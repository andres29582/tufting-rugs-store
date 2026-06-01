const es = {} as const;

const pt = {} satisfies Record<keyof typeof es, string>;

export const adminTranslations = { es, pt } as const;
