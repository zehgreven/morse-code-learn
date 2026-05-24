import { describe, it, expect } from 'vitest';
import { classifyPress, THRESHOLDS } from '../src/utils/timer.js';

describe('classifyPress', () => {
  it('classifies a short press as dot', () => {
    expect(classifyPress(100)).toBe('dot');
    expect(classifyPress(199)).toBe('dot');
  });

  it('classifies a press at threshold as dash', () => {
    expect(classifyPress(THRESHOLDS.DOT_MAX_MS)).toBe('dash');
  });

  it('classifies a long press as dash', () => {
    expect(classifyPress(500)).toBe('dash');
  });
});
