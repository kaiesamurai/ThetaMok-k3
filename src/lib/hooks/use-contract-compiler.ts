import { useReducer } from 'react';

import type TArtifact from '@/lib/artifacts';

import { LlmService } from '@defibuilder/sdk';

import { useToast } from '@/lib/hooks/use-toast';
import EReducerState from '@/lib/reducer-state';
import {
  compileContractInitialState,
  compileContractReducer
} from '@/lib/reducers/compile-contract';

export default function useContractCompiler() {
  const { toast } = useToast();

  const [compileContractState, dispatchCompileContract] = useReducer(
    compileContractReducer,
    compileContractInitialState
  );

  async function compileContract(contractCode: string, maxTries = 3) {
    try {
      dispatchCompileContract({
        state: EReducerState.start,
        payload: null
      });

      const compilation = await LlmService.buildCode(contractCode);

      if (!compilation?.success) {
        if (maxTries > 0) {
          toast({
            variant: 'destructive',
            title: 'Oops, compilation did not succeed',
            description: `Relax, our AI friend is taking care of it! \n Remaining Attempts: ${maxTries}`
          });

          const fixedContractCode = await LlmService.callBuildResolverLLM(
            contractCode,
            compilation.message
          );

          return await compileContract(fixedContractCode, maxTries - 1);
        }

        dispatchCompileContract({
          state: EReducerState.error,
          payload: compilation.message
        });

        toast({
          variant: 'destructive',
          title: 'Oops, the processor overheated',
          description:
            'Our AI friend could not figure out your requirements. Please be more precise with your smart contract description and try again!'
        });

        console.error(`ERROR ERROR CONTRACT COMPILER | ATTEMPT ${maxTries}`, compilation);
        return null;
      }

      dispatchCompileContract({
        state: EReducerState.success,
        payload: compilation.artifact as TArtifact
      });

      return contractCode;
    } catch (error: unknown) {
      dispatchCompileContract({
        state: EReducerState.error,
        payload: null
      });

      console.error('CATCH ERROR CONTRACT COMPILER', error);

      return null;
    }
  }

  return {
    isCompiling: compileContractState.isLoading,
    isCompilationError: compileContractState.isError,
    isCompilationSuccess: compileContractState.isSuccess,
    contractArtifact: compileContractState.artifact,
    compileContract,
    dispatchCompileContract
  };
}
