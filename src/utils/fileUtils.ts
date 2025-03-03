import * as fs from 'fs/promises';

export async function folderExists(folderPath: string): Promise<boolean> {
  return fs.stat(folderPath).then(() => true).catch(() => false);
}

export async function isFile(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}