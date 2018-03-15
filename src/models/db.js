import SQLite from 'react-native-sqlite-storage';

export default class DB {
  static DATABASE_NAME = 'test.db';
  static DATABASE_VERSION = 1;
  static db;

  //create table
  static setupTable = (resolve, reject) =>
    new Promise(() => {
      console.log('Creating table');
      DB.db.sqlBatch(
        [
          'CREATE TABLE IF NOT EXISTS Version(version_id INTEGER PRIMARY KEY NOT NULL);',
          `INSERT INTO Version VALUES(${DB.DATABASE_VERSION});`,
          `CREATE TABLE IF NOT EXISTS Notes(
            id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
						title TEXT,
						detail TEXT
          );
          `,
          `CREATE TABLE IF NOT EXISTS Items(
            id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
            note_id INTEGER,
            text TEXT,
            FOREIGN KEY(note_id) REFERENCES Notes(id)
          );`
        ],
        resolve,
        reject
      );
      console.log(resolve, reject);
      console.log('created');
    });

  static checkDatabase = () =>
    new Promise((resolve, reject) => {
      console.log('Checking database version');
      DB.db.executeSql(
        'SELECT * FROM Version LIMIT 1',
        [],
        // Check database version
        res => {
          if (res.rows.item(0).version_id !== DB.DATABASE_VERSION) {
            // TO DO Update database table
            return reject(
              new Error(
                `version missmatch expected ${DB.DATABASE_VERSION}, but get ${
                  res.rows.item(0).version_id
                }`
              )
            );
          }
          return resolve(res.rows.item(0).version_id);
        },
        // Database not detected, call setup table
        err => {
          console.log(err);
          return DB.setupTable(resolve, reject);
        }
      );
    });

  static loadDatabase = () =>
    new Promise((resolve, reject) => {
      SQLite.openDatabase(
        {
          name: DB.DATABASE_NAME,
          location: 'default'
        },
        database => resolve(database),
        reject
      );
    });

  static getDb = async () => {
    try {
      console.log('loading database');
      DB.db = await DB.loadDatabase();
      console.log('checking tables');
      const res = await DB.checkDatabase();
      console.log('database ready');
      return res;
    } catch (err) {
      return err;
    }
  };
  static execute = (query, params = []) =>
    new Promise((resolve, reject) => {
      DB.db.executeSql(query, params, resolve, reject);
    });

  static executeBatch = query =>
    new Promise((resolve, reject) => {
      DB.db.sqlBatch(query, resolve, reject);
    });
}
