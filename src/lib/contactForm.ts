export const MAX_NAME_LENGTH = 50;
export const MAX_MESSAGE_LENGTH = 2000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[\d\s+\-()]{10,}$/;

export interface ContactFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export const findContactError = ({
  firstName,
  lastName,
  email,
  phone,
  message,
}: ContactFields): string | null => {
  if (firstName.length === 0 || lastName.length === 0) return 'Enter your first and last name.';
  if (firstName.length > MAX_NAME_LENGTH || lastName.length > MAX_NAME_LENGTH) {
    return `Shorten the name to ${MAX_NAME_LENGTH} characters each.`;
  }
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address, like name@example.com.';
  if (phone && !PHONE_PATTERN.test(phone)) {
    return 'Use only numbers, spaces, +, (), or - in the phone number.';
  }
  if (message.length === 0) return 'Write a message before sending.';
  if (message.length > MAX_MESSAGE_LENGTH) {
    return `Shorten the message to ${MAX_MESSAGE_LENGTH} characters.`;
  }
  return null;
};
