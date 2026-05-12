import { randomBytes } from 'crypto';

const ORDER_CODE_PREFIX = 'RUG';
const ORDER_CODE_SUFFIX_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ORDER_CODE_SUFFIX_LENGTH = 4;

export function generateOrderPublicCode(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const suffix = generateSuffix(ORDER_CODE_SUFFIX_LENGTH);

  return `${ORDER_CODE_PREFIX}-${yyyy}${mm}${dd}-${suffix}`;
}

function generateSuffix(length: number): string {
  const bytes = randomBytes(length);
  let suffix = '';

  for (const byte of bytes) {
    suffix += ORDER_CODE_SUFFIX_ALPHABET.charAt(byte % ORDER_CODE_SUFFIX_ALPHABET.length);
  }

  return suffix;
}
