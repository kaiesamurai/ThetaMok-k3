import { useReducer } from 'react';

import type { TContractType } from '@defibuilder/sdk';

import { LlmService } from '@defibuilder/sdk';

import EReducerState from '@/lib/reducer-state';
import {
  generateContractInitialState,
  generateContractReducer
} from '@/lib/reducers/generate-contract';

import { useToast } from './use-toast';

export default function useContractGenerator() {
  const [generateContractState, dispatchGenerateContract] = useReducer(
    generateContractReducer,
    generateContractInitialState
  );

  const { toast } = useToast();

  async function generateContract(prompt: string, templateName: TContractType) {
    try {
      dispatchGenerateContract({
        state: EReducerState.start,
        payload: null
      });

      const remainingRequests = await LlmService.getRemainingRequests('generator');
      if (remainingRequests <= 0) {
        toast({
          title: 'Rate Limit Error',
          description: 'Too many requests. Please try again later.',
          variant: 'destructive'
        });

        dispatchGenerateContract({
          state: EReducerState.error,
          payload: null
        });

        return null;
      }

      const contractCode = await LlmService.callGeneratorLLM(prompt, templateName);

      if (contractCode === null || contractCode === undefined || typeof contractCode !== 'string') {
        dispatchGenerateContract({
          state: EReducerState.error,
          payload: null
        });

        console.error('LLM ERROR CONTRACT GENERATOR');

        return null;
      }

      dispatchGenerateContract({
        state: EReducerState.success,
        payload: contractCode
      });

      return contractCode;
    } catch (error: unknown) {
      dispatchGenerateContract({
        state: EReducerState.error,
        payload: null
      });

      console.error('CATCH ERROR CONTRACT GENERATOR', error);

      return null;
    }
  }

  return {
    isGenerating: generateContractState.isLoading,
    isGenerationError: generateContractState.isError,
    isGenerationSuccess: generateContractState.isSuccess,
    contractCode: generateContractState.contractCode,
    generateContract,
    dispatchGenerateContract
  };
}
