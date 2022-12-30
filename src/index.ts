const parseArgs = require('minimist');

import {
  Commands,
  read_file,
  EXIT_CODE,
  AccessDeniedError,
  FileNotFoundError,
  is_binary,
  help_message,
  VERSION_STRING,
} from './typecat';

function main(): number {
  const args: Commands = parseArgs(process.argv.slice(2));
  // args._ is the default name for any unnamed options
  // renames args._ to args.files and delete args._
  args.files = args._ ?? [];
  delete args._;
  if (args.help || args.h) {
    help_message();
    process.exitCode = EXIT_CODE.get();
    return process.exitCode;
  }
  if (args.version || args.v) {
    console.log(VERSION_STRING);
    process.exitCode = EXIT_CODE.get();
    return process.exitCode;
  }
  for (const file of args.files) {
    try {
      const banne_string = '-';
      const banner_length = file.length + 12;
      // read_file if its not a binary and force isn't set else make it null
      const contents =
        is_binary(file) && (args.f || args.force) ? read_file(file) : null;
      if (!contents) {
        console.log(`${file} <BINARY>\n`);
        continue;
      }
      if (args.banner || args.b) {
        console.log(
          `CONTENTS OF ${file}\n${banne_string.repeat(banner_length)}`
        );
      }
      if (args.number || args.n) {
        for (let i = 0; i < contents.split('\n').length; i++) {
          console.log(i + 1, `${contents.split('\n')[i]}`);
        }
        console.log(); //newline after each file
      } else {
        console.log(`${contents}\n`);
      }
    } catch (e) {
      if (e instanceof AccessDeniedError || e instanceof FileNotFoundError) {
        EXIT_CODE.set(e.exit_code);
        console.error(e.message);
      } else {
        console.error(`unexpected error: ${e}`);
      }
    }
  }
  process.exitCode = EXIT_CODE.get();
  return process.exitCode;
}

main();
