import 'dotenv/config';

import { createEncryptor } from './utils/simple-encryptor.js';

const usage = `encrypt.ts

USAGE
  ts-node encrypt.ts json`;

const [, , option] = process.argv;

if (process.argv.length !== 3 || !option) {
  console.error(usage);
  process.exit(1);
}

if (option === '--help' || option === '-h') {
  console.log(usage);
  process.exit(0);
}

const { WESCAL_SECRET } = process.env;

if (typeof WESCAL_SECRET !== 'string') {
  console.error('Missing environment variable WESCAL_SECRET');
  process.exit(2);
}

const encryptor = createEncryptor(WESCAL_SECRET);

const json = JSON.parse(option);

const encrypted = encryptor.encrypt(json);

process.stdout.write(encrypted);
