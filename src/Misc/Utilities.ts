export const sortStr = (a: string, b: string): number => a.localeCompare(b);

export const unique = <T extends unknown>(items: T[]): T[] => items.filter((i, idx) => !items.find((i2, idx2) => idx2 < idx && i === i2));