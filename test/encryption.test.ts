import { processFolder } from '../src/encryption/encryption';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Encryption', () => {
  const testFolder = path.join(__dirname, 'test_folder');
  const testFile = path.join(testFolder, 'test.txt');
  const testContent = 'Hello, world!';

  // Ensure clean state before each test
  beforeEach(async () => {
    await fs.rm(testFolder, { recursive: true, force: true }); // Cleanup
    await fs.mkdir(testFolder, { recursive: true });
    await fs.writeFile(testFile, testContent);
  });

  // Cleanup after all tests
  afterAll(async () => {
    await fs.rm(testFolder, { recursive: true, force: true });
  });

  it('should encrypt and decrypt a file', async () => {
    // Encrypt
    await processFolder(testFolder, 'testPassword', 'encrypt');
    
    const encryptedFile = testFile + '.enc';
    const saltFile = path.join(testFolder, 'salt.bin');
    
    // Check encrypted file exists
    await expect(fs.stat(encryptedFile)).resolves.toBeDefined();
    await expect(fs.stat(saltFile)).resolves.toBeDefined();
    await expect(fs.stat(testFile)).rejects.toThrow(); // Original file should be gone

    // Decrypt
    await processFolder(testFolder, 'testPassword', 'decrypt');
    
    // Check original file is restored
    const decryptedContent = await fs.readFile(testFile, 'utf-8');
    expect(decryptedContent).toBe(testContent);
    await expect(fs.stat(encryptedFile)).rejects.toThrow(); // Encrypted file should be gone
    await expect(fs.stat(saltFile)).rejects.toThrow(); // Salt file should be gone
  }, 10000); // Increase timeout to 10s for file operations
});