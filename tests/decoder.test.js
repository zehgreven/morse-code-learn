import { describe, it, expect } from 'vitest';
import { decode } from '../src/core/decoder.js';

describe('decode', () => {
  it('decodes single dot → E', () => {
    expect(decode(['dot']).letter).toBe('E');
  });

  it('decodes single dash → T', () => {
    expect(decode(['dash']).letter).toBe('T');
  });

  it('decodes .- → A', () => {
    expect(decode(['dot', 'dash']).letter).toBe('A');
  });

  it('decodes -. → N', () => {
    expect(decode(['dash', 'dot']).letter).toBe('N');
  });

  it('decodes ... → S', () => {
    expect(decode(['dot', 'dot', 'dot']).letter).toBe('S');
  });

  it('decodes --- → O', () => {
    expect(decode(['dash', 'dash', 'dash']).letter).toBe('O');
  });

  it('decodes .... → H', () => {
    expect(decode(['dot', 'dot', 'dot', 'dot']).letter).toBe('H');
  });

  it('decodes --.- → Q', () => {
    expect(decode(['dash', 'dash', 'dot', 'dash']).letter).toBe('Q');
  });

  it('returns null for empty sequence', () => {
    expect(decode([]).letter).toBeNull();
  });

  it('returns null for unknown sequence', () => {
    expect(decode(['dot', 'dot', 'dot', 'dot', 'dot']).letter).toBeNull();
  });
});
