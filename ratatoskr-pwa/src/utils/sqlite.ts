import initSqlJs from 'sql.js';

let SQL: any = null;

export async function getSQL() {
  if (!SQL) {
    SQL = await (initSqlJs as any)({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
  }
  return SQL;
}

export async function createSqliteDb(data: any): Promise<Uint8Array> {
  const SQL = await getSQL();
  const db = new SQL.Database();

  db.run("CREATE TABLE config (key TEXT PRIMARY KEY, value TEXT)");

  const stmt = db.prepare("INSERT INTO config (key, value) VALUES (?, ?)");
  for (const [key, value] of Object.entries(data)) {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    stmt.run([key, stringValue]);
  }
  stmt.free();

  const binaryDb = db.export();
  db.close();
  return binaryDb;
}

export async function parseSqliteDb(binaryData: Uint8Array): Promise<any> {
  const SQL = await getSQL();
  const db = new SQL.Database(binaryData);

  const res = db.exec("SELECT key, value FROM config");
  const result: any = {};

  if (res.length > 0) {
    for (const row of res[0].values) {
      const key = row[0] as string;
      const value = row[1] as string;

      try {
        // Only parse if it looks like JSON array or object
        if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
          result[key] = JSON.parse(value);
        } else {
          result[key] = value;
        }
      } catch {
        result[key] = value;
      }
    }
  }

  db.close();
  return result;
}
