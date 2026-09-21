import { z } from 'zod';

/**
 * Esquema das variáveis de ambiente da aplicação.
 *
 * Tudo que vem de `process.env` é string ou undefined, por isso os campos
 * numéricos usam `coerce`. Ajuste este esquema a cada nova variável.
 */
const esquemaEnv = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_HOST: z.string().min(1).default('localhost'),
  DATABASE_PORT: z.coerce.number().int().positive().default(5432),
  DATABASE_NAME: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1)
});

export type Env = z.infer<typeof esquemaEnv>;

/**
 * Valida e converte as variáveis de ambiente.
 *
 * Chame uma única vez no boot da aplicação e injete o resultado onde for
 * preciso: assim a configuração falha cedo, com mensagem clara, em vez de
 * quebrar mais tarde por uma variável ausente ou mal formatada.
 *
 * @param fonte Origem das variáveis; por padrão `process.env`.
 * @throws {Error} Se alguma variável estiver ausente ou inválida.
 */
export function carregarEnv(fonte: NodeJS.ProcessEnv = process.env): Env {
  const resultado = esquemaEnv.safeParse(fonte);

  if (!resultado.success) {
    throw new Error(
      `Variáveis de ambiente inválidas:\n${z.prettifyError(resultado.error)}`
    );
  }

  return resultado.data;
}
