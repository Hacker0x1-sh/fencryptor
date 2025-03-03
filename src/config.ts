export const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
export const KEY_LENGTH = 32; // AES-256 key length
export const IV_LENGTH = 16;  // AES IV length
export const ITERATIONS = 1000000; // PBKDF2 iterations
export const SALT_FILE = 'salt.bin'; // File to store salt