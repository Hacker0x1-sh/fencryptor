import { program } from 'commander';
import { processPath } from '../encryption/encryption';
import { EncryptionOptions, Mode } from '../encryption/types';
import { folderExists, isFile } from '../utils/fileUtils';
import * as path from 'path';

const BANNER = `
   _____ _   _ _____   _____   _____ 
  /     | | | |     | |     | |     | 
 /______| |_| |_____| |_____| |_____| 
 |  *** |     |  *** |  ***  |  ***  | 
 |  *** |_____|  *** |_______|_______|
 
  F E N C R Y P T O R  v1.0.0
  > Secure Your [Target] Data, Hack the World <
  > Encrypt or Decrypt files or folders with ease! <
  > By Kris, Ho Kai Chun
`;

function getDefaultFolder(): string {
  return path.join(process.env.USERPROFILE || process.env.HOME || '', 'Desktop');
}

function getRootFolder(): string {
  return process.platform === 'win32' ? 'C:\\' : '/';
}

export function setupCLI(): void {
  program
    .name('fencryptor')
    .description('A CLI tool to encrypt or decrypt files or folders. Use "*" for Desktop, "**" for root.')
    .version('1.0.0')
    .on('--help', () => {
      // Prepend banner to help output
      console.log(BANNER);
    });

  program
    .command('encrypt')
    .description('Encrypt a file or folder')
    .argument('<path>', 'File or folder path to encrypt (use * for Desktop, ** for root)')
    .option('-p, --password <password>', 'Encryption password', 'defaultPassword123')
    .action(async (targetPath: string, options: { password: string }) => {
      let resolvedPath = targetPath;
      if (targetPath === '*') resolvedPath = getDefaultFolder();
      else if (targetPath === '**') resolvedPath = getRootFolder();
      await runCommand({ folderPath: resolvedPath, password: options.password, mode: 'encrypt' });
    })
    .on('--help', () => {
      console.log(BANNER);
    });

  program
    .command('decrypt')
    .description('Decrypt a file or folder')
    .argument('<path>', 'File or folder path to decrypt (use * for Desktop, ** for root)')
    .option('-p, --password <password>', 'Decryption password', 'defaultPassword123')
    .action(async (targetPath: string, options: { password: string }) => {
      let resolvedPath = targetPath;
      if (targetPath === '*') resolvedPath = getDefaultFolder();
      else if (targetPath === '**') resolvedPath = getRootFolder();
      await runCommand({ folderPath: resolvedPath, password: options.password, mode: 'decrypt' });
    })
    .on('--help', () => {
      console.log(BANNER);
    });

  // Show banner if no arguments provided
  if (!process.argv.slice(2).length) {
    console.log(BANNER);
    program.help();
  }

  program.parseAsync(process.argv);
}

async function runCommand(options: EncryptionOptions): Promise<void> {
  try {
    if (!(await folderExists(options.folderPath) || await isFile(options.folderPath))) {
      throw new Error(`Path does not exist: ${options.folderPath}`);
    }
    const isSingleFile = await isFile(options.folderPath);
    console.log(`${options.mode === 'encrypt' ? 'Encrypting' : 'Decrypting'} ${isSingleFile ? 'file' : 'folder'}: ${options.folderPath}`);
    if (options.folderPath === getDefaultFolder() && options.mode === 'encrypt') {
      console.warn('WARNING: Encrypting all files on Desktop. Ensure you have a backup!');
    } else if (options.folderPath === getRootFolder() && options.mode === 'encrypt') {
      console.warn('WARNING: Encrypting ALL files from root directory. This may affect system files! Ensure you have a full backup!');
    }
    await processPath(options.folderPath, options.password, options.mode);
    console.log(`${options.mode === 'encrypt' ? 'Encryption' : 'Decryption'} completed!`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${options.mode} failed: ${error.message}`);
    } else {
      console.error(`${options.mode} failed: ${String(error)}`);
    }
    process.exit(1);
  }
}