import { describe, expect, it } from 'vitest';
import { PriceDeviationService } from './PriceDeviationService';

describe('PriceDeviationService', () => {
  it('detects normal stable pricing without triggering alerts', () => {
    const service = new PriceDeviationService();
    service.recordAndEvaluate('XLM', 0.12);
    const alert = service.recordAndEvaluate('XLM', 0.122);

    expect(alert.isTriggered).toBe(false);
    expect(alert.actionRequired).toBe('none');
    expect(alert.deviationPercent).toBeLessThan(5);
  });

  it('triggers alert on 15% price divergence', () => {
    const service = new PriceDeviationService();
    service.recordAndEvaluate('XLM', 1.0);
    const alert = service.recordAndEvaluate('XLM', 1.18); // +18%

    expect(alert.isTriggered).toBe(true);
    expect(alert.actionRequired).toBe('alert');
    expect(alert.deviationPercent).toBe(18);
  });

  it('triggers circuit breaker pause on flash crash exceeding 30%', () => {
    const service = new PriceDeviationService();
    service.recordAndEvaluate('RWA_PROP_1', 100.0);
    const alert = service.recordAndEvaluate('RWA_PROP_1', 65.0); // -35% crash

    expect(alert.isTriggered).toBe(true);
    expect(alert.actionRequired).toBe('pause_circuit_breaker');
    expect(alert.deviationPercent).toBe(35);
  });
});
