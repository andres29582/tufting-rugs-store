import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const PASSWORD_HASH_PREFIX = 'scrypt';
const KEY_LENGTH = 64;

@Injectable()
export class AdminPasswordService {
  hash(password: string): string {
    const salt = randomBytes(16).toString('base64');
    const key = scryptSync(password, salt, KEY_LENGTH).toString('base64');
    return `${PASSWORD_HASH_PREFIX}$${salt}$${key}`;
  }

  verify(password: string, storedHash: string): boolean {
    const [prefix, salt, key] = storedHash.split('$');

    if (prefix !== PASSWORD_HASH_PREFIX || !salt || !key) {
      return false;
    }

    const expected = Buffer.from(key, 'base64');
    const actual = scryptSync(password, salt, KEY_LENGTH);

    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
}
