import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import { objectStoresMeta } from '../components/indexedDb/dbConfig';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const reinitializeIndexedDB = (version) => {
  const dbName = 'ESTATEDB';
  const dbVersion = version; // Increment the version to trigger an upgrade

  const request = indexedDB.open(dbName, dbVersion);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    // Delete existing object stores if they exist
    objectStoresMeta.forEach((storeMeta) => {
      const { store } = storeMeta;
      if (db.objectStoreNames.contains(store)) {
        db.deleteObjectStore(store);
      }
    });

    // Iterate through objectStoresMeta array and create object stores
    objectStoresMeta.forEach((storeMeta) => {
      const { store, storeConfig, storeSchema } = storeMeta;

      // Create object store
      const objectStore = db.createObjectStore(store, storeConfig);

      // Create indexes as specified in storeSchema
      storeSchema.forEach((index) => {
        objectStore.createIndex(index.name, index.keypath, index.options);
      });
    });
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    db.close();
    console.log('IndexedDB reinitialized successfully.');
    callback();
  };

  request.onerror = (event) => {
    console.error('Error reinitializing IndexedDB:', event.target.error);
  };
};

const extractNestedValue = (record, dataIndex) => {
  if (dataIndex instanceof Array) {
    return dataIndex.reduce((acc, key) => acc[key], record);
  }
  return record[dataIndex];
};

export const exportToExcel = (dataSource, columns, fileName) => {
  const data = dataSource.map((record) =>
    columns.map((column) => {
      const rawValue = extractNestedValue(record, column.dataIndex);
      // Handle special rendering logic for specific columns
      if (column.render) {
        return column.render(rawValue, record);
      }
      return rawValue;
    })
  );

  const ws = XLSX.utils.aoa_to_sheet([
    columns.map((column) => column.title),
    ...data,
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
};

const usedStrings = new Set();

export function generateUniqueString() {
  const alphanumeric =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  do {
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumeric.length);
      randomString += alphanumeric[randomIndex];
    }
  } while (usedStrings.has(randomString));

  usedStrings.add(randomString);
  return randomString;
}
