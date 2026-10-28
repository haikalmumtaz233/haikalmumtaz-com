import { describe, expect, it } from 'vitest';
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, findContactError } from './contactForm';

const valid = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '',
  message: 'Hello there',
};

describe('findContactError', () => {
  it('accepts a complete form without a phone number', () => {
    expect(findContactError(valid)).toBeNull();
  });

  it('accepts a phone number with spaces, plus, dashes and brackets', () => {
    expect(findContactError({ ...valid, phone: '+62 (812) 3456-7890' })).toBeNull();
  });

  it('requires both names', () => {
    expect(findContactError({ ...valid, lastName: '' })).toBe('Enter your first and last name.');
  });

  it('caps each name length', () => {
    const name = 'a'.repeat(MAX_NAME_LENGTH + 1);
    expect(findContactError({ ...valid, firstName: name })).toBe(
      `Shorten the name to ${MAX_NAME_LENGTH} characters each.`,
    );
  });

  it.each(['plain', 'no@tld', 'spa ce@example.com'])('rejects the email %s', (email) => {
    expect(findContactError({ ...valid, email })).toBe(
      'Enter a valid email address, like name@example.com.',
    );
  });

  it.each(['abc', '12345', '0812-abc-999'])('rejects the phone %s', (phone) => {
    expect(findContactError({ ...valid, phone })).toBe(
      'Use only numbers, spaces, +, (), or - in the phone number.',
    );
  });

  it('requires a message', () => {
    expect(findContactError({ ...valid, message: '' })).toBe('Write a message before sending.');
  });

  it('caps the message length', () => {
    const message = 'a'.repeat(MAX_MESSAGE_LENGTH + 1);
    expect(findContactError({ ...valid, message })).toBe(
      `Shorten the message to ${MAX_MESSAGE_LENGTH} characters.`,
    );
  });

  it('reports the first problem in form order', () => {
    expect(findContactError({ ...valid, firstName: '', email: 'bad', message: '' })).toBe(
      'Enter your first and last name.',
    );
  });
});
