import { useReducer } from 'react';

import { LlmService } from '@defibuilder/sdk';

import EReducerState from '@/lib/reducer-state';
import { auditContractInitialState, auditContractReducer } from '@/lib/reducers/audit-contract';

export default function useContractAuditor() {
  const [auditContractState, dispatchAuditContract] = useReducer(
    auditContractReducer,
    auditContractInitialState
  );

  async function auditContract(contractCode: string) {
    try {
      dispatchAuditContract({
        state: EReducerState.start,
        payload: null
      });

      const audit = await LlmService.callAuditorLLM(contractCode);

      if (audit === null || audit === undefined || !Array.isArray(audit)) {
        dispatchAuditContract({
          state: EReducerState.error,
          payload: null
        });

        console.error('LLM ERROR CONTRACT AUDITOR');

        return null;
      }

      dispatchAuditContract({
        state: EReducerState.success,
        payload: audit
      });

      return contractCode;
    } catch (error: unknown) {
      dispatchAuditContract({
        state: EReducerState.error,
        payload: null
      });

      console.error('CATCH ERROR CONTRACT AUDITOR', error);

      return null;
    }
  }

  return {
    isAuditing: auditContractState.isLoading,
    isAuditionError: auditContractState.isError,
    isAuditionSuccess: auditContractState.isSuccess,
    audit: auditContractState.audit,
    auditContract,
    dispatchAuditContract
  };
}
