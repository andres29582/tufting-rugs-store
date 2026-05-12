import { generateOrderPublicCode } from './order-code';

describe('generateOrderPublicCode', () => {
  it('generates a customer-facing code with the expected date format', () => {
    const code = generateOrderPublicCode(new Date(2026, 4, 5));

    expect(code).toMatch(/^RUG-20260505-[A-Z0-9]{4}$/);
  });
});
