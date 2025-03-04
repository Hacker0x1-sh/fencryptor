# Encryption CLI [F E N C R Y P T O R  v1.0.0]
```
   _____ _   _ _____   _____   _____ 
  /     | | | |     | |     | |     | 
 /______| |_| |_____| |_____| |_____| 
 |  *** |     |  *** |  ***  |  ***  | 
 |  *** |_____|  *** |_______|_______|
 
  F E N C R Y P T O R  v1.0.0
  > Secure Your Data, Hack the World <
```

A TypeScript CLI tool to encrypt or decrypt files in a folder using AES-256-CBC.

## Setup
1. Install Node.js and npm.
2. Run `npm install` to install dependencies.
3. Compile with `npm run build`.

## Usage
- Encrypt: `npm start -- encrypt <folder> -p <password>`
- Decrypt: `npm start -- decrypt <folder> -p <password>`
- Help: `node ./dist/index.js --help`

## Notes
- Test on a small folder first to avoid data loss.
- Passwords are passed as arguments (insecure for production; consider prompting).
- A PDF report (`fencryptor-report-<date>.pdf`) is generated in the current directory after each encrypt/decrypt operation, listing the operation details and affected files.
- After each encrypt/decrypt operation, a report folder (e.g., `report-2025-03-03T14-30-25`) is created in the fencryptor installation directory (e.g., `C:\Users\YourUsername\AppData\Roaming\npm`). Inside, you'll find:
- `fencryptor-report.pdf`: A professional PDF report with summary, affected files table, logs, and system details.
- `fencryptor-report.log`: Log file with operation details and console output.
- `README.txt`: Information about the report and tool usage.

## Usage
- **Encrypt**: `fencryptor encrypt <path> -p <password>`
  - Generates a PDF report after completion.
- **Decrypt**: `fencryptor decrypt <path> -p <password>`
  - Generates a PDF report after completion.
- **Show Tool Location**: `fencryptor location`
- **Help**: `fencryptor --help`


