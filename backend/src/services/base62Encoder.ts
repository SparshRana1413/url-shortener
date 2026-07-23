const BASE62_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Encodes a PostgreSQL BIGSERIAL ID into a Base62 string.
 */
export function base62Encode(id: number | string | bigint): string {
  let num: bigint = BigInt(id);

  if (num === 0n) return BASE62_CHARS[0]!;
  if (num < 0n) {
    throw new RangeError("ID must be a non-negative integer");
  }

  let encoded: string = "";
  const base: bigint = 62n;

  while (num > 0n) {
    const remainder = num % base;
    encoded = BASE62_CHARS[Number(remainder)]! + encoded;
    num = num / base;
  }

  return encoded;
}

/**
 * Decodes a Base62 string into a decimal string.
 * Returning a string safely preserves PostgreSQL BIGSERIAL precision.
 */
export function base62Decode(str: string): string {
  if (!str) return "0";

  let num: bigint = 0n;
  const base: bigint = 62n;

  for (let i = 0; i < str.length; i++) {
    const char = str[i]!;
    const index = BASE62_CHARS.indexOf(char);

    if (index === -1) {
      throw new Error(`Invalid character in Base62 string: ${char}`);
    }

    num = num * base + BigInt(index);
  }

  return num.toString();
}