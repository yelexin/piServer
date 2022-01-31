import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// you would have to import / invoke this in another file
export async function openDb() {
  return open({
    filename: 'sqliteDb/pi.db',
    driver: sqlite3.Database,
  });
}

export type Database =  Awaited<ReturnType<typeof openDb>>;
