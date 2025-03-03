import { program } from 'commander';
import { processPath } from '../encryption/encryption';
import { EncryptionOptions, Mode } from '../encryption/types';
import { folderExists, isFile } from '../utils/fileUtils';
import { generatePDFReport, ReportData } from '../utils/pdfReport';
import * as path from 'path';

const BANNER = `
   _____ _   _ _____   _____   _____ 
  /     | | | |     | |     | |     | 
 /______| |_| |_____| |_____| |_____| 
 |  *** |     |  *** |  ***  |  ***  | 
 |  *** |_____|  *** |_______|_______|
 
  F E N C R Y P T O R  v1.0.0
  > Secure Your Data, Hack the World <
`;

function getDefaultFolder(): string {
  return path.join(process.env.USERPROFILE || process.env.HOME || '', 'Desktop');
}

function getRootFolder(): string {
  return process.platform === 'win32' ? 'C:\\' : '/';
}

export function setupCLI(): void {

  console.log(BANNER);

  program
    .name('fencryptor')
    .description('A CLI tool to encrypt or decrypt files or folders. Use "*" for Desktop, "**" for root.')
    .version('1.0.0')
    .addHelpText('beforeAll', BANNER);

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
    });

  program
    .command('location')
    .description('Show the installation directory of fencryptor')
    .action(() => {
      const toolPath = path.dirname(process.argv[1]);
      console.log(`fencryptor is installed at: ${toolPath}`);
    });

  if (!process.argv.slice(2).length) {
    console.log(BANNER);
    program.help();
  }

  program.parseAsync(process.argv).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
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

    // Track affected files
    const affectedFiles: string[] = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog(...args);
      const message = args[0];
      if (message.startsWith('Encrypted:') || message.startsWith('Decrypted:')) {
        affectedFiles.push(message.split(': ')[1]);
      }
    };

    await processPath(options.folderPath, options.password, options.mode);

    // Restore console.log and generate report
    console.log = originalConsoleLog;
    console.log(`${options.mode === 'encrypt' ? 'Encryption' : 'Decryption'} completed!`);

    const reportData: ReportData = {
      operation: options.mode,
      targetPath: options.folderPath,
      affectedFiles,
      timestamp: new Date()
    };
    const reportPath = generatePDFReport(reportData);
    console.log(`Report generated: ${reportPath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${options.mode} failed: ${error.message}`);
    } else {
      console.error(`${options.mode} failed: ${error}`);
    }
    process.exit(1);
  }
}