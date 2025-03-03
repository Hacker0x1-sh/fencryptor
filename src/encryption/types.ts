export type Mode = 'encrypt' | 'decrypt';

export interface EncryptionOptions {
  folderPath: string;
  password: string;
  mode: Mode;
}