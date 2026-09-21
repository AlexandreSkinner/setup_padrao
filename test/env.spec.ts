import { describe, test, expect } from 'vitest';
import { carregarEnv } from '@/config/env';

const ambienteMinimo = {
  DATABASE_NAME: 'app',
  DATABASE_USER: 'postgres',
  DATABASE_PASSWORD: 'senha'
};

describe('carregarEnv', () => {
  test('aplica os valores padrão quando só o obrigatório é informado', () => {
    const env = carregarEnv(ambienteMinimo);

    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3000);
    expect(env.DATABASE_HOST).toBe('localhost');
    expect(env.DATABASE_PORT).toBe(5432);
  });

  test('converte para número as variáveis numéricas', () => {
    const env = carregarEnv({ ...ambienteMinimo, PORT: '8080' });

    expect(env.PORT).toBe(8080);
  });

  test('falha quando uma variável obrigatória está ausente', () => {
    expect(() => carregarEnv({ DATABASE_NAME: 'app' })).toThrow(
      /Variáveis de ambiente inválidas/
    );
  });

  test('falha quando o valor não corresponde ao esquema', () => {
    expect(() =>
      carregarEnv({ ...ambienteMinimo, NODE_ENV: 'staging' })
    ).toThrow(/NODE_ENV/);
  });
});
