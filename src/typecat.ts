import {isBinaryFileSync} from 'isbinaryfile';

const fs = require('fs');
const PROGNAME = 'typecat';
const VERSION = '0.9.5';
export const VERSION_STRING = `${PROGNAME} ${VERSION}`;
/**
 * A class for managing the exit code of a process.
 */
class ExitCode {
  /**
   * The current exit code.
   */
  private EXIT_CODE = 0;

  /**
   * Returns the current exit code.
   * @returns The current exit code.
   */
  get(): number {
    return this.EXIT_CODE;
  }

  /**
   * Sets the exit code.
   * @param code The new exit code.
   */
  set(code: number) {
    this.EXIT_CODE = code;
  }
}
export const EXIT_CODE = new ExitCode();

/**
 * A class representing an error with an associated exit code and name.
 */
class ErrorProps extends Error {
  /**
   * The exit code associated with the error.
   */
  public readonly exit_code: number;

  /**
   * Creates a new `ErrorProps` instance.
   * @param message The error message.
   * @param name The name of the error.
   * @param exit_code The exit code associated with the error.
   */
  constructor(message: string | undefined, name: string, exit_code: number) {
    super(message);
    this.exit_code = exit_code;
    this.name = name;
  }
}

/**
 * An error representing an attempt to access a resource that is not authorized.
 */
export class AccessDeniedError extends ErrorProps {
  /**
   * Creates a new `AccessDeniedError` instance.
   * @param message The error message.
   */
  constructor(message: string | undefined) {
    super(message, 'AccessDeniedError', 13);
  }
}

/**
 * An error representing an attempt to access a file that does not exist.
 */
export class FileNotFoundError extends ErrorProps {
  /**
   * Creates a new `FileNotFoundError` instance.
   * @param message The error message.
   */
  constructor(message: string | undefined) {
    super(message, 'FileNotFoundError', 2);
  }
}

/**
 * Reads the contents of a file and returns the result as a string.
 * @param filename - The path to the file to read.
 * @returns The contents of the file as a string.
 * @throws {Error} If the file cannot be read.
 */
export function read_file(filename: string): string {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (err) {
    // casts err to Error for better error handling
    const error = err as Error;
    // prepares error for error handling
    const error_string: string = error.toString();
    if (error_string.includes('EACCES')) {
      //EXIT_CODE.set(13);
      throw new AccessDeniedError(error_string);
    }
    if (error_string.includes('ENOENT')) {
      //EXIT_CODE.set(2);
      throw new FileNotFoundError(error_string);
    }

    throw err;
  }
}
export function is_binary(filename: string): boolean {
  const bytes = fs.readFileSync(filename);
  const size = fs.lstatSync(filename).size;
  return isBinaryFileSync(bytes, size);
}
/**
 * Flattens an array with elements of any type.
 * @param arr - The array to flatten.
 * @returns A new array with the elements of `arr` flattened to a single level.
 * @example
 * flatten([1, [2, [3, [4, 5]]]]); // [1, 2, 3, 4, 5]
 * flatten([1, [2, [3, 'hello']], [6, [7, 8]]]); // [1,2,3,"hello", 6, 7, 8]
 */
export function flatten<T>(arr: T[]): T[] {
  const result: T[] = [];
  for (const element of arr) {
    if (Array.isArray(element)) {
      result.push(...flatten(element));
    } else {
      result.push(element);
    }
  }
  return result;
}

export function help_message() {
  console.log('Usage: typecat [OPTIONS] [FILES]\n');
  console.log('Options:');
  console.log('\t -b, --banner          Displays filename before each file');
  console.log('\t -n, --number          Line number, starts at 1');
  console.log('\t -f, --force           Reads any file no matter the type');
  console.log('\t -v, --version         Shows the version number and exits');
  console.log('\t -h, --help            Shows this help message and exits');
  console.log(`\nMade by Tr4shL0rd\n${VERSION_STRING}`);
}

/**
 * Represents the command line arguments for the program.
 */
export interface Commands {
  /**An optional array of strings representing positional arguments.*/
  _?: string[];
  /**An array of strings representing the `files` flag.*/
  files: string[];
  /**A boolean representing the `banner` flag.*/
  banner: boolean;
  /**Shorthand for --banner */
  b: boolean;
  /**A boolean representing the `number` flag.*/
  number: boolean;
  /**Shorthand for --number */
  n: boolean;
  /**A boolean representing the `version` flag.*/
  version: boolean;
  /**Shorthand for --version */
  v: boolean;
  /**A boolean representing the `help` flag.*/
  help: boolean;
  /**Shorthand for --help */
  h: boolean;
  /**A boolean representing the `force` flag. */
  force: boolean;
  /**Shorthand for --force */
  f: boolean;
}
