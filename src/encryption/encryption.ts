import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ENCRYPTION_ALGORITHM, KEY_LENGTH, IV_LENGTH, ITERATIONS, SALT_FILE } from '../config';
import { Mode } from './types';
import { isFile } from '../utils/fileUtils';

async function generateKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, 'sha256', (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
}

async function encryptFile(filePath: string, key: Buffer): Promise<void> {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

  const input = (await fs.open(filePath, 'r')).createReadStream();
  const output = (await fs.open(filePath + '.enc', 'w')).createWriteStream();

  await new Promise<void>((resolve, reject) => {
    output.write(iv); // Write IV first
    input.pipe(cipher).pipe(output);
    output.on('finish', () => resolve());
    output.on('error', reject);
    cipher.on('error', reject);
  });

  await fs.unlink(filePath);
  console.log(`Encrypted: ${filePath}`);
}

async function decryptFile(filePath: string, key: Buffer): Promise<void> {
  const input = (await fs.open(filePath, 'r')).createReadStream();
  const output = (await fs.open(filePath.replace('.enc', ''), 'w')).createWriteStream();

  let iv: Buffer;
  await new Promise<void>((resolve, reject) => {
    input.once('readable', () => {
      iv = input.read(IV_LENGTH); // Read IV from start
      if (!iv || iv.length !== IV_LENGTH) {
        reject(new Error('Invalid IV length in encrypted file'));
        return;
      }
      const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
      input.pipe(decipher).pipe(output);
      decipher.on('error', reject);
      output.on('finish', () => resolve());
      output.on('error', reject);
    });
    input.on('error', reject);
  });

  await fs.unlink(filePath);
  console.log(`Decrypted: ${filePath}`);
}

export async function processPath(targetPath: string, password: string, mode: Mode): Promise<void> {
  if (!(await fs.stat(targetPath))) {
    throw new Error(`${mode === 'encrypt' ? 'Path' : 'Encrypted file/folder'} does not exist: ${targetPath}`);
  }

  if (await isFile(targetPath)) {
    const salt = crypto.randomBytes(IV_LENGTH);
    const key = await generateKey(password, salt);
    const saltPath = targetPath + '.salt';

    if (mode === 'encrypt') {
      await fs.writeFile(saltPath, salt);
      await encryptFile(targetPath, key);
    } else if (mode === 'decrypt' && targetPath.endsWith('.enc')) {
      const saltFile = targetPath.replace('.enc', '.salt');
      if (!await fs.stat(saltFile).then(() => true).catch(() => false)) {
        throw new Error(`Salt file not found: ${saltFile}`);
      }
      const salt = await fs.readFile(saltFile);
      const key = await generateKey(password, salt); // Recompute key with correct salt
      await decryptFile(targetPath, key);
      await fs.unlink(saltFile);
    }
  } else {
    const saltPath = path.join(targetPath, SALT_FILE);
    let salt: Buffer;

    if (mode === 'encrypt') {
      salt = crypto.randomBytes(IV_LENGTH);
      await fs.writeFile(saltPath, salt);
    } else {
      if (!await fs.stat(saltPath).then(() => true).catch(() => false)) {
        throw new Error(`Salt file not found: ${saltPath}`);
      }
      salt = await fs.readFile(saltPath);
    }

    const key = await generateKey(password, salt);
    const files = await fs.readdir(targetPath, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(targetPath, file.name);
      if (file.isDirectory()) {
        await processPath(fullPath, password, mode);
      } else if (mode === 'encrypt' && !fullPath.endsWith('.enc') && fullPath !== saltPath) {
        await encryptFile(fullPath, key);
      } else if (mode === 'decrypt' && fullPath.endsWith('.enc')) {
        await decryptFile(fullPath, key);
      }
    }

    if (mode === 'decrypt') {
      await fs.unlink(saltPath);
    }
  }
}