# Encryption CLI [F E N C R Y P T O R  v1.0.0]

A TypeScript CLI tool to encrypt or decrypt files in a folder using AES-256-CBC.

## Setup
1. Install Node.js and npm.
2. Run `npm install` to install dependencies.
3. Compile with `npm run build`.

## Usage
- Encrypt: `npm start -- encrypt <folder> -p <password>`
- Decrypt: `npm start -- decrypt <folder> -p <password>`
- Help: `npm start -- --help`

## Notes
- Test on a small folder first to avoid data loss.
- Passwords are passed as arguments (insecure for production; consider prompting).