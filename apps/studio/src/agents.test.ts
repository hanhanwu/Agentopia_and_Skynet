import { describe, expect, it } from 'vitest';
import { agents, isAgentId } from './agents.ts';

describe('studio agent fixtures', () => {
  it('contains exactly the two approved visible agents', () => {
    expect(Object.keys(agents)).toEqual(['personal-assistant', 'cafe-service']);
  });

  it('recognizes only known stable agent ids', () => {
    expect(isAgentId('personal-assistant')).toBe(true);
    expect(isAgentId('cafe-service')).toBe(true);
    expect(isAgentId('unknown-agent')).toBe(false);
  });
});
