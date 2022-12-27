import * as fs from 'fs';

async function readFile(filename: string): Promise<string>{
  return await fs.promises.readFile(filename, "utf8");
}
