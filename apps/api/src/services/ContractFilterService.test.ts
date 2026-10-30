import { describe, expect, it } from 'bun:test';
import { ContractFilterService } from './ContractFilterService';

describe('ContractFilterService', () => {
  const dummyContractId = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

  it('builds a valid Soroban RPC getEvents filter payload', () => {
    const payload = ContractFilterService.buildEventFilter({
      contractIds: [dummyContractId],
      topics: [['deposit', '*']],
      startLedger: 1050200,
      limit: 100,
    });

    expect(payload.filters.length).toBe(1);
    expect(payload.filters[0].type).toBe('contract');
    expect(payload.filters[0].contractIds).toContain(dummyContractId);
    expect(payload.filters[0].topics).toEqual([['deposit', '*']]);
    expect(payload.startLedger).toBe(1050200);
    expect(payload.limit).toBe(100);
  });

  it('clamps limit to maximum 1000 items', () => {
    const payload = ContractFilterService.buildEventFilter({
      contractIds: [dummyContractId],
      limit: 5000,
    });

    expect(payload.limit).toBe(1000);
  });

  it('throws an error if contractIds array is empty', () => {
    expect(() => {
      ContractFilterService.buildEventFilter({
        contractIds: [],
      });
    }).toThrow('At least one contract ID must be provided');
  });

  it('validates Soroban contract IDs correctly', () => {
    expect(ContractFilterService.isValidContractId(dummyContractId)).toBe(true);
    expect(ContractFilterService.isValidContractId('GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ')).toBe(false);
    expect(ContractFilterService.isValidContractId('invalid')).toBe(false);
  });

  it('builds action topic filters with optional subtopics', () => {
    const topic = ContractFilterService.buildActionTopicFilter('repay', ['user123', 'asset456']);
    expect(topic).toEqual(['repay', 'user123', 'asset456']);
  });
});
