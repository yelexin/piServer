import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import {config} from '../configs/config'

// you would have to import / invoke this in another file
export async function openDb() {
  return open({
    filename: config.db.path,
    driver: sqlite3.Database,
  });
}

export type Database =  Awaited<ReturnType<typeof openDb>>;
