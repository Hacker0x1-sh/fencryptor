fencryptor Command-Line Reference
Version 1.0.0
Last Updated: March 02, 2025

Overview
fencryptor is a TypeScript-based CLI tool for encrypting and decrypting files or folders using AES-256-CBC encryption. This document lists all available commands, their syntax, and examples.

General Commands

1. Show Help
   Description: Displays usage information, available commands, and options.
   Syntax: npm start -- --help
   Global Syntax: fencryptor --help
   Alias: -h
   Example: npm start -- --help
   Output:
      Usage: fencryptor [options] [command]
      A CLI tool to encrypt or decrypt files or folders. Use "*" for all files on Desktop.
      Options:
        -V, --version  output the version number
        -h, --help     display help for command
      Commands:
        encrypt <path>  Encrypt a file or folder
        decrypt <path>  Decrypt a file or folder

2. Show Version
   Description: Displays the tool’s version number.
   Syntax: npm start -- --version
   Global Syntax: fencryptor --version
   Alias: -V
   Example: npm start -- --version
   Output: 1.0.0

Encryption Commands

3. Encrypt a Single File
   Description: Encrypts a single file, creating <filename>.enc and <filename>.salt.
   Syntax: npm start -- encrypt "<file-path>" -p <password>
   Global Syntax: fencryptor encrypt "<file-path>" -p <password>
   Example: npm start -- encrypt "C:\Users\Ethical_Hacker\Desktop\secret.txt" -p mySecretPassword
   Output:
      Encrypting file: C:\Users\Ethical_Hacker\Desktop\secret.txt
      Encrypted: C:\Users\Ethical_Hacker\Desktop\secret.txt
      Encryption completed!

4. Encrypt a Folder
   Description: Encrypts all files in a folder recursively, creating .enc files and a salt.bin.
   Syntax: npm start -- encrypt "<folder-path>" -p <password>
   Global Syntax: fencryptor encrypt "<folder-path>" -p <password>
   Example: npm start -- encrypt "C:\Users\Ethical_Hacker\Desktop\test_folder" -p mySecretPassword
   Output:
      Encrypting folder: C:\Users\Ethical_Hacker\Desktop\test_folder
      Encrypted: C:\Users\Ethical_Hacker\Desktop\test_folder\file1.txt
      ...
      Encryption completed!

5. Encrypt All Desktop Files
   Description: Encrypts all files on the Desktop using the '*' wildcard, with a warning.
   Syntax: npm start -- encrypt * -p <password>
   Global Syntax: fencryptor encrypt * -p <password>
   Example: npm start -- encrypt * -p mySecretPassword
   Output:
      Encrypting folder: C:\Users\Ethical_Hacker\Desktop
      WARNING: Encrypting all files on Desktop. Ensure you have a backup!
      Encrypted: C:\Users\Ethical_Hacker\Desktop\file1.txt
      ...
      Encryption completed!

Decryption Commands

6. Decrypt a Single File
   Description: Decrypts a single .enc file, restoring the original file and removing .enc and .salt.
   Syntax: npm start -- decrypt "<file-path>.enc" -p <password>
   Global Syntax: fencryptor decrypt "<file-path>.enc" -p <password>
   Example: npm start -- decrypt "C:\Users\Ethical_Hacker\Desktop\secret.txt.enc" -p mySecretPassword
   Output:
      Decrypting file: C:\Users\Ethical_Hacker\Desktop\secret.txt.enc
      Decrypted: C:\Users\Ethical_Hacker\Desktop\secret.txt.enc
      Decryption completed!

7. Decrypt a Folder
   Description: Decrypts all .enc files in a folder recursively, restoring originals and removing salt.bin.
   Syntax: npm start -- decrypt "<folder-path>" -p <password>
   Global Syntax: fencryptor decrypt "<folder-path>" -p <password>
   Example: npm start -- decrypt "C:\Users\Ethical_Hacker\Desktop\test_folder" -p mySecretPassword
   Output:
      Decrypting folder: C:\Users\Ethical_Hacker\Desktop\test_folder
      Decrypted: C:\Users\Ethical_Hacker\Desktop\test_folder\file1.txt.enc
      ...
      Decryption completed!

8. Decrypt All Desktop Files
   Description: Decrypts all .enc files on the Desktop using the '*' wildcard.
   Syntax: npm start -- decrypt * -p <password>
   Global Syntax: fencryptor decrypt * -p <password>
   Example: npm start -- decrypt * -p mySecretPassword
   Output:
      Decrypting folder: C:\Users\Ethical_Hacker\Desktop
      Decrypted: C:\Users\Ethical_Hacker\Desktop\file1.txt.enc
      ...
      Decryption completed!

Development Commands

9. Build the Project
   Description: Compiles TypeScript to JavaScript in the dist/ folder.
   Syntax: npm run build

10. Run Tests
    Description: Executes Jest unit tests in the tests/ folder.
    Syntax: npm test

11. Link Globally
    Description: Installs fencryptor as a global command.
    Syntax: npm link
    Windows (Admin): Start-Process powershell -Verb RunAs -ArgumentList "npm link"

12. Unlink Globally
    Description: Removes the global fencryptor command.
    Syntax: npm unlink fencryptor

Notes
- Use quotes around paths with spaces or special characters.
- The -p option is optional; defaults to "defaultPassword123" if omitted.
- Always back up files before encrypting, especially with '*'.