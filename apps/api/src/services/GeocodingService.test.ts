import { describe, expect, it } from 'vitest';
import { GeocodingService } from './GeocodingService';

describe('GeocodingService', () => {
  it('resolves physical addresses to coordinates and cadastral zones with caching', async () => {
    const service = new GeocodingService();
    const res = await service.geocodeAddress('100 Congress Ave, Austin, Texas');

    expect(res.city).toBe('Austin');
    expect(res.country).toBe('US');
    expect(res.cadastreZone).toBe('CAD-US-TX-TRAVIS');
    expect(res.latitude).toBeCloseTo(30.2672);

    // Second call should return cached object
    const resCached = await service.geocodeAddress('100 Congress Ave, Austin, Texas');
    expect(resCached).toBe(res);
  });
});
