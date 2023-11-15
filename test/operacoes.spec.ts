import { describe, test, expect } from 'vitest';
import { soma, subtracao, multiplicacao } from '@/one/two/operacoes';

describe('teste operacoes aritmeticas', () => {
  test('testa soma', () => {
    const resultado = soma(2, 1);
    const esperado = 3;
    expect(resultado).toBe(esperado);
  });
  test('testa subtração', () => {
    const resultado = subtracao(2, 1);
    const esperado = 1;
    expect(resultado).toBe(esperado);
  });
  test('testa multiplicação', () => {
    const resultado = multiplicacao(2, 3);
    const esperado = 6;
    expect(resultado).toBe(esperado);
  });
});
