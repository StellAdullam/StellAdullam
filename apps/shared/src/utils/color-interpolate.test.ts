import { describe, expect, it } from 'vitest';
import { hexToRgb, interpolateColor, rgbToHex } from './color-interpolate';

describe('Color Interpolation Utilities', () => {
  it('converts hex strings to RGB objects and back', () => {
    const rgb = hexToRgb('#ff0000');
    expect(rgb).toEqual({ r: 255, g: 0, b: 0 });

    const hex = rgbToHex(255, 0, 0);
    expect(hex.toLowerCase()).toBe('#ff0000');
  });

  it('interpolates midpoint color between black and white to middle gray', () => {
    const mid = interpolateColor('#000000', '#ffffff', 0.5);
    expect(mid.toLowerCase()).toBe('#808080');
  });

  it('clamps factor between 0.0 and 1.0', () => {
    expect(interpolateColor('#000000', '#ffffff', -1.0).toLowerCase()).toBe('#000000');
    expect(interpolateColor('#000000', '#ffffff', 2.0).toLowerCase()).toBe('#ffffff');
  });
});
