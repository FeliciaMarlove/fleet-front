import { BelgianPhoneNumberPipe } from './belgian-phone-number.pipe';

/**
 * Unit test for phone number transformation
 */
describe('Test', () => {
  const pipe = new BelgianPhoneNumberPipe();
  it('should create an instance', () => {
    expect(new BelgianPhoneNumberPipe()).toBeTruthy();
  });
  it('should return number with local format', () => {
    expect(pipe.transform('065347571')).toBe('065 34 75 71');
  });
  it('should return number with mobile format', () => {
    expect(pipe.transform('0475347571')).toBe('0475 34 75 71');
  });
});
