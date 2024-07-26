import React, { Suspense, useEffect, useReducer, useState } from 'react';

import type { PublicClient, WalletClient } from 'viem';

import { encodeDeployData } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';

import TArtifact from '@/lib/artifacts';
import TChain from '@/lib/chains';
import { copyToClipboard, isClipboardApiSupported } from '@/lib/clipboard';
import { fileExtension } from '@/lib/constants';
import downloadContent from '@/lib/download';
import { mapViemErrorToMessage } from '@/lib/errors-mapper';
import EReducerState from '@/lib/reducer-state';
import { deployContractInitialState, deployContractReducer } from '@/lib/reducers/deploy-contract';

import CopyButton from '../../copy-button';
import DownloadButton from '../../download-button';
import ExternalAnchor from '../../external-anchor';
import { Skeleton } from '../../ui/skeleton';
import { Textarea } from '../../ui/textarea';
import SectionContainer from '../container';
import SectionHeader from '../header';

const DeploymentDialog = React.lazy(() => import('./deployment-dialog'));

export type TConstructorArgument = {
  name: string;
  type: string;
};

export type TConstructorArgumentValue = Record<string, string>;

type TSmartContractCodeSectionProperties = {
  publicClient: PublicClient;
  walletClient: WalletClient;
  activeChain: TChain;
  smartContractCode: string;
  contractArtifacts: TArtifact | null;
};

export default function CodeViewerSection({
  publicClient,
  walletClient,
  activeChain,
  smartContractCode,
  contractArtifacts
}: TSmartContractCodeSectionProperties) {
  const { chainId, isConnected, address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [constructorArguments, setConstructorArguments] = useState<TConstructorArgument[]>([]);
  const [constructorArgumentsValue, setConstructorArgumentsValue] =
    useState<TConstructorArgumentValue>({});

  const [deployContractState, dispatchDeployContract] = useReducer(
    deployContractReducer,
    deployContractInitialState
  );

  useEffect(() => {
    if (!contractArtifacts) {
      return;
    }

    for (const element of contractArtifacts.abi) {
      if (
        element !== null &&
        element !== undefined &&
        'type' in element &&
        typeof element.type === 'string' &&
        element.type === 'constructor'
      ) {
        const constructor = element;

        if (constructor !== null && constructor !== undefined && 'inputs' in constructor) {
          const _constructorArguments: TConstructorArgument[] = [];
          const _constructorArgumentsValue: TConstructorArgumentValue = {};

          for (const input of constructor.inputs) {
            if (
              input !== null &&
              input !== undefined &&
              typeof input === 'object' &&
              'name' in input &&
              typeof input.name === 'string' &&
              'type' in input &&
              typeof input.type === 'string'
            ) {
              _constructorArguments.push({
                name: input.name,
                type: input.type
              });
              _constructorArgumentsValue[input.name] = '';
            }
          }

          setConstructorArguments(_constructorArguments);
          setConstructorArgumentsValue(_constructorArgumentsValue);
        }

        break;
      }
    }
  }, [contractArtifacts]);

  async function deployContract() {
    if (!address || !contractArtifacts) {
      return;
    }

    dispatchDeployContract({
      state: EReducerState.start,
      payload: null
    });

    try {
      if (chainId !== activeChain.network.id) {
        await switchChainAsync({ chainId: activeChain.network.id });
      }

      const data = encodeDeployData({
        abi: contractArtifacts.abi,
        bytecode: contractArtifacts.bytecode,
        args: Object.values(constructorArgumentsValue)
      });

      const estimateGas = await publicClient.estimateGas({
        to: null,
        account: address,
        data
      });

      const hash = await walletClient.deployContract({
        abi: contractArtifacts.abi,
        account: address,
        bytecode: contractArtifacts.bytecode,
        args: Object.values(constructorArgumentsValue),
        gas: estimateGas,
        chain: activeChain.network
      });

      const transactionReceipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('transactionReceipt', transactionReceipt);

      dispatchDeployContract({
        state: EReducerState.success,
        payload: transactionReceipt.contractAddress as string
      });
    } catch (error: unknown) {
      const errorMessage = mapViemErrorToMessage(error);

      dispatchDeployContract({
        state: EReducerState.error,
        payload: errorMessage
      });

      console.error('Error deploying smart contract', error);
    }
  }

  return (
    <SectionContainer>
      <SectionHeader>
        <div className='flex flex-col'>
          <h3 className='text-xl font-semibold md:text-2xl lg:text-3xl'>Smart Contract Code</h3>
          <h4 className='text-base font-medium text-muted-foreground md:text-lg'>
            View the smart contract for your {activeChain.name} project
          </h4>
        </div>

        {deployContractState.contractAddress && (
          <div className='flex items-end gap-2.5'>
            <div className='flex flex-col gap-y-1'>
              <p className='text-sm text-muted-foreground'>Smart Contract address:</p>
              <ExternalAnchor
                href={`${activeChain.network.blockExplorers?.default.url}/address/${deployContractState.contractAddress}`}
                className='text-sm hover:underline'
              >
                <span>
                  {`${deployContractState.contractAddress?.slice(0, 8)}...${deployContractState.contractAddress?.slice(-8)}`}
                </span>
              </ExternalAnchor>
            </div>

            {isClipboardApiSupported && (
              <CopyButton
                iconClassName='w-2.5 h-2.5'
                buttonClassName='w-5 h-5'
                onClick={async () => copyToClipboard(deployContractState.contractAddress ?? '')}
              />
            )}
          </div>
        )}

        {contractArtifacts && (
          <Suspense fallback={<Skeleton className='h-10 md:w-[11.5rem]' />}>
            {isConnected ? (
              <DeploymentDialog
                constructorArguments={constructorArguments}
                constructorArgumentsValue={constructorArgumentsValue}
                deployContractState={deployContractState}
                dispatchDeployContract={dispatchDeployContract}
                setConstructorArgumentsValue={setConstructorArgumentsValue}
                onDeployClick={deployContract}
              />
            ) : (
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              /* @ts-ignore */
              <w3m-button label='Connect Wallet to Deploy' />
            )}
          </Suspense>
        )}
      </SectionHeader>

      <div className='relative'>
        <Textarea
          value={smartContractCode}
          className='h-96 w-full resize-none rounded-3xl p-5 focus-visible:ring-0'
          readOnly
        />

        {isClipboardApiSupported && (
          <CopyButton
            onClick={async () => copyToClipboard(smartContractCode)}
            buttonClassName='absolute right-20 top-5'
          />
        )}

        <DownloadButton
          size='icon'
          variant='outline'
          className='absolute right-5 top-5'
          onButtonClick={() => downloadContent(smartContractCode, `smart-contract${fileExtension}`)}
        />
      </div>
    </SectionContainer>
  );
}
