import { Server, Service, SortOption } from './App'; 
import { ColorPalette } from './hooks/useThemeManager'; // Updated import

// Directly use IndexedDB as primary storage
const DB_NAME = 'selfhosted_dashboard';
const DB_VERSION = 1;
const STORE_NAME = 'servers_store';
export const DB_KEY = 'servers_data'; // Export if needed elsewhere, or keep local
export const PALETTE_KEY = 'color_palette'; // Export if needed elsewhere
export const PREFERENCES_KEY = 'user_preferences'; // Export if needed elsewhere

// Helper function to open IndexedDB
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = (event) => {
        console.error("Error opening IndexedDB", event);
        reject(new Error("Could not open IndexedDB"));
      };
      
      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    } catch (error) {
      console.error("Critical error opening IndexedDB:", error);
      reject(error);
    }
  });
};

// Save data to IndexedDB
export const saveToIndexedDB = async (data: Server[]): Promise<boolean> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.put({
        id: DB_KEY,
        data
      });
      
      request.onsuccess = () => {
        console.log("Data saved to IndexedDB successfully", data);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error("Error saving to IndexedDB", event);
        resolve(false);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB save failed", error);
    return false;
  }
};

// Get data from IndexedDB
export const getFromIndexedDB = async (): Promise<Server[] | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.get(DB_KEY);
      
      request.onsuccess = () => {
        if (request.result) {
          console.log("Data retrieved from IndexedDB", request.result.data);
          resolve(request.result.data);
        } else {
          console.log("No data found in IndexedDB");
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error("Error reading from IndexedDB", event);
        resolve(null);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB get failed", error);
    return null;
  }
};

// Save color palette to IndexedDB
export const savePaletteToIndexedDB = async (palette: ColorPalette): Promise<boolean> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.put({
        id: PALETTE_KEY,
        data: palette
      });
      
      request.onsuccess = () => {
        console.log("Color palette saved to IndexedDB successfully", palette);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error("Error saving palette to IndexedDB", event);
        resolve(false);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB palette save failed", error);
    return false;
  }
};

// Get color palette from IndexedDB
export const getPaletteFromIndexedDB = async (): Promise<ColorPalette | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.get(PALETTE_KEY);
      
      request.onsuccess = () => {
        if (request.result) {
          console.log("Color palette retrieved from IndexedDB", request.result.data);
          resolve(request.result.data);
        } else {
          console.log("No color palette found in IndexedDB");
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error("Error reading palette from IndexedDB", event);
        resolve(null);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB palette get failed", error);
    return null;
  }
};

// Save user preferences to IndexedDB
export const savePreferencesToIndexedDB = async (preferences: { sortBy: SortOption }): Promise<boolean> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.put({
        id: PREFERENCES_KEY,
        data: preferences
      });
      
      request.onsuccess = () => {
        console.log("User preferences saved to IndexedDB successfully", preferences);
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error("Error saving preferences to IndexedDB", event);
        resolve(false);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB preferences save failed", error);
    return false;
  }
};

// Get user preferences from IndexedDB
export const getPreferencesFromIndexedDB = async (): Promise<{ sortBy: SortOption } | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.get(PREFERENCES_KEY);
      
      request.onsuccess = () => {
        if (request.result) {
          console.log("User preferences retrieved from IndexedDB", request.result.data);
          resolve(request.result.data);
        } else {
          console.log("No user preferences found in IndexedDB");
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error("Error reading preferences from IndexedDB", event);
        resolve(null);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB preferences get failed", error);
    return null;
  }
}; 