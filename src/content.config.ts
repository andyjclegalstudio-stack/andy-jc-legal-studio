import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    nombre: z.string(),
    orden: z.number(),
    incluye: z.string(),
    plazo: z.string(),
    precio: z.string(),
    area: z.enum(['empresarial', 'digital', 'ambas']),
  }),
});

const academy = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/academy' }),
  schema: z.object({
    titulo: z.string(),
    tipo: z.enum(['taller', 'charla', 'seminario', 'curso']),
    fecha: z.date(),
    hora: z.string(),
    duracion: z.string(),
    modalidad: z.enum(['virtual', 'presencial', 'híbrido']),
    lugar: z.string(),
    precio: z.string(),
    cupos: z.number().optional(),
    estado: z.enum(['abierto', 'por-anunciar', 'cerrado', 'grabado']),
    resumen: z.string(),
    dirigido: z.string(),
  }),
});

export const collections = { servicios, academy };
