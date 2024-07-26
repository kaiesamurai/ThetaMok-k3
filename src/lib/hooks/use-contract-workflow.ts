import type { TContractType } from '@defibuilder/sdk';

import EReducerState from '../reducer-state';
import useContractAuditor from './use-contract-auditor';
import useContractCompiler from './use-contract-compiler';
import useContractGenerator from './use-contract-generator';
import { useToast } from './use-toast';

export default function useContractWorkflow() {
  const {
    isGenerating,
    isGenerationError,
    isGenerationSuccess,
    contractCode,
    generateContract,
    dispatchGenerateContract
  } = useContractGenerator();

  const {
    isCompiling,
    isCompilationError,
    isCompilationSuccess,
    contractArtifact,
    compileContract,
    dispatchCompileContract
  } = useContractCompiler();

  const {
    isAuditing,
    isAuditionError,
    isAuditionSuccess,
    audit,
    auditContract,
    dispatchAuditContract
  } = useContractAuditor();

  const { toast } = useToast();

  async function initContractWorkflow(userPrompt: string, activeTemplateName: string) {
    if (userPrompt.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Prompt Error',
        description: 'Please provide a prompt to generate a contract.'
      });

      return;
    }

    dispatchGenerateContract({
      state: EReducerState.reset,
      payload: null
    });

    dispatchCompileContract({
      state: EReducerState.reset,
      payload: null
    });

    dispatchAuditContract({
      state: EReducerState.reset,
      payload: null
    });

    let contractCode = await generateContract(userPrompt, activeTemplateName as TContractType);

    if (contractCode) {
      const fixedContractCode = await compileContract(contractCode);

      if (fixedContractCode && contractCode !== fixedContractCode) {
        contractCode = fixedContractCode;

        dispatchGenerateContract({
          state: EReducerState.success,
          payload: fixedContractCode
        });
      }

      await auditContract(contractCode);
    }
  }

  return {
    isGenerating,
    isGenerationError,
    isGenerationSuccess,
    contractCode,
    isCompiling,
    isCompilationError,
    isCompilationSuccess,
    contractArtifact,
    isAuditing,
    isAuditionError,
    isAuditionSuccess,
    audit,
    initContractWorkflow
  };
}
