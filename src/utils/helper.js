import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import {objectStoresMeta} from '../components/indexedDb/dbConfig'



export const reinitializeIndexedDB = (version) => {
  const dbName = "ESTATEDB";
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
  };

  request.onerror = (event) => {
    console.error('Error reinitializing IndexedDB:', event.target.error);
  };
};




