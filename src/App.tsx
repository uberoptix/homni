import { useState, useEffect, useRef } from 'react'
import './App.css'
import React from 'react'
import FlexGrid from './components/MasonryGrid'

/**
 * IMPORTANT: Data Privacy Notice
 * 
 * This application is designed to store all server and personal information
 * exclusively on the client device using IndexedDB and localStorage.
 * 
 * DO NOT:
 * - Commit any personal server information to this codebase
 * - Store IP addresses or hostnames in the source code
 * - Include real server configurations in examples or tests
 * 
 * All user data should remain on the user's device and in their local backups.
 */

interface Server {
  id: string;
  name: string;
  hostname: string;
  services: Service[];
  notes?: string;
  notesVisible: boolean;
}

interface Service {
  id: string;
  name: string;
  port: number;
  path?: string;
  notes?: string;
}

interface ColorPalette {
  headerBackground: string;
  pageBackground: string;
  serverBackground: string;
  serviceBackground: string; // Also used for search, muted buttons
  serverText: string; // Also used for Add Service
  serviceText: string; // Also used for buttons palette
  secondaryText: string; // Used for IP & Port
  accentButton: string;
  secondaryButton: string; // Used for Import, Export, and Port buttons
  primaryButtonText: string; // Text color for primary/accent buttons
  secondaryButtonText: string; // Text color for secondary buttons
  statusRed: string;
  statusAmber: string;
  statusGreen: string;
}

// Default color palette (Dark Theme)
const defaultPalette: ColorPalette = {
  headerBackground: '#101010',
  pageBackground: '#202020',
  serverBackground: '#181818',
  serviceBackground: '#202020',
  serverText: '#FFFFFF',
  serviceText: '#DBA33A',
  secondaryText: '#919191',
  accentButton: '#C17F33',
  secondaryButton: '#535353', // Dark gray for secondary buttons
  primaryButtonText: '#FFFFFF', // White text for primary buttons
  secondaryButtonText: '#FFFFFF', // White text for secondary buttons
  statusRed: '#EC6141',
  statusAmber: '#DBA33A',
  statusGreen: '#7BB961'
};

// Light Theme with Evernote colors
const lightPalette: ColorPalette = {
  headerBackground: '#E9FDF1', // Light mint green
  pageBackground: '#F2F2F2', // Light gray
  serverBackground: '#FFFFFF', // White
  serviceBackground: '#C9CFD1', // Light grayish
  serverText: '#2C3E50', // Dark blue-gray
  serviceText: '#00a82d', // Updated from #2DBE60 to #00a82d
  secondaryText: '#7D7D7D', // Medium gray
  accentButton: '#00a82d', // Updated from #2DBE60 to #00a82d
  secondaryButton: '#C9CFD1', // Light grayish
  primaryButtonText: '#FFFFFF', // White text for primary buttons
  secondaryButtonText: '#2C3E50', // Dark text for secondary buttons
  statusRed: '#EC6141', // Same as dark theme
  statusAmber: '#DBA33A', // Same as dark theme
  statusGreen: '#7BB961'  // Same as dark theme
};

type SortOption = 'name' | 'port';
type StorageType = 'localStorage' | 'sessionStorage' | 'indexedDB' | 'none';

// Directly use IndexedDB as primary storage
const DB_NAME = 'selfhosted_dashboard';
const DB_VERSION = 1;
const STORE_NAME = 'servers_store';
const DB_KEY = 'servers_data';
const PALETTE_KEY = 'color_palette';
const PREFERENCES_KEY = 'user_preferences';

// Helper function to open IndexedDB
const openDB = (): Promise<IDBDatabase> => {
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
const saveToIndexedDB = async (data: Server[]): Promise<boolean> => {
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
      
      // Close database when transaction is complete
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
const getFromIndexedDB = async (): Promise<Server[] | null> => {
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
      
      // Close database when transaction is complete
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
const savePaletteToIndexedDB = async (palette: ColorPalette): Promise<boolean> => {
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
      
      // Close database when transaction is complete
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
const getPaletteFromIndexedDB = async (): Promise<ColorPalette | null> => {
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
      
      // Close database when transaction is complete
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
const savePreferencesToIndexedDB = async (preferences: { sortBy: SortOption }): Promise<boolean> => {
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
      
      // Close database when transaction is complete
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
const getPreferencesFromIndexedDB = async (): Promise<{ sortBy: SortOption } | null> => {
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
      
      // Close database when transaction is complete
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("IndexedDB preferences get failed", error);
    return null;
  }
};

function App() {
  const [servers, setServers] = useState<Server[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditingServer, setIsEditingServer] = useState(false);
  const [newServer, setNewServer] = useState({ name: '', hostname: '', notes: '', notesVisible: false });
  const [editingServerId, setEditingServerId] = useState<string | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [currentServerId, setCurrentServerId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newService, setNewService] = useState<{ name: string; port: string; path: string; notes: string }>({ name: '', port: '', path: '', notes: '' });
  const [sortBy, setSortBy] = useState<SortOption>('name');
  // @ts-ignore - used in fallback storage logic
  const [storageType, setStorageType] = useState<StorageType>('indexedDB');
  const [dataLoaded, setDataLoaded] = useState(false);
  // @ts-ignore - used in form focus handling
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{show: boolean, message: string}>({
    show: false,
    message: ''
  });
  const [colorPalette, setColorPalette] = useState<ColorPalette>(defaultPalette);
  const [isPaletteDialogOpen, setIsPaletteDialogOpen] = useState(false);
  
  // Refs for dialogs
  const serverDialogRef = useRef<HTMLDivElement>(null);
  const serviceDialogRef = useRef<HTMLDivElement>(null);
  const paletteDialogRef = useRef<HTMLDivElement>(null);

  // Filter servers based on search term
  // Priority order:
  // 1. First tries to find servers that have services matching the search term
  // 2. If no services match, falls back to finding servers that match the search term
  const getFilteredServers = () => {
    if (!searchTerm.trim()) {
      return getSortedServers();
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // IMPORTANT: First priority - check for services that match the search term
    const serversWithMatchingServices = servers.filter(server => 
      server.services.some(service => 
        service.name.toLowerCase().includes(lowerSearchTerm)
      )
    );
    
    // If any services match, return those servers
    if (serversWithMatchingServices.length > 0) {
      console.log("Service match found - prioritizing services");
      return serversWithMatchingServices;
    }
    
    // Second priority - If no services match, then fall back to filtering servers by name
    console.log("No service match found - falling back to server names");
    const filteredByServerName = servers.filter(server => 
      server.name.toLowerCase().includes(lowerSearchTerm)
    );
    
    return filteredByServerName;
  };

  // Filter services based on search term
  // Behavior depends on the search context:
  // 1. If any service matches the search term, only show matching services
  // 2. If we're showing a server based on its name, show all services for that server
  // 3. If neither context applies, show no services (empty array)
  const getFilteredServices = (services: Service[]) => {
    if (!searchTerm.trim()) {
      return getSortedServices(services);
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // IMPORTANT: First check if we're in a service-name search context
    const anyServiceMatches = servers.some(server => 
      server.services.some(service => 
        service.name.toLowerCase().includes(lowerSearchTerm)
      )
    );
    
    if (anyServiceMatches) {
      // Show only services that match the search term
      console.log("Filtering to show only matching services");
      return getSortedServices(
        services.filter(service => 
          service.name.toLowerCase().includes(lowerSearchTerm)
        )
      );
    }
    
    // Second: Check if we're in a server-name search context
    const serverMatch = servers.some(server => 
      server.name.toLowerCase().includes(lowerSearchTerm)
    );
    
    if (serverMatch) {
      // If filtering by server name, show all services for that server
      console.log("Server name match - showing all services");
      return getSortedServices(services);
    }
    
    // Default: no results
    return [];
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Just prevent default form submission, filtering happens as you type
  };

  // Handle form-group active state
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setActiveInputId(e.currentTarget.id);
  };

  const handleInputBlur = () => {
    setActiveInputId(null);
  };

  // Show notification
  const showNotification = (message: string) => {
    setNotification({ show: true, message });
    
    // Hide after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  // Apply a theme palette
  const applyTheme = (theme: 'dark' | 'light') => {
    const palette = theme === 'dark' ? defaultPalette : lightPalette;
    setColorPalette(palette);
    applyColorPalette(palette);
    showNotification(`${theme === 'dark' ? 'Dark' : 'Light'} theme applied`);
  };

  // Load data and color palette on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get servers
        const serversData = await getFromIndexedDB();
        if (serversData) {
          // Ensure all servers have notesVisible property properly set
          const updatedServers = serversData.map((server) => ({
            ...server,
            notesVisible: server.notesVisible === true // Explicitly check for true, defaults to false
          }));
          console.log('Loaded servers with updated notesVisible flags:', updatedServers);
          setServers(updatedServers);
        } else {
          try {
            // Fallback to localStorage
            const localData = localStorage.getItem('servers');
            if (localData) {
              const parsedData = JSON.parse(localData);
              // Ensure all servers have notesVisible property properly set
              const updatedServers = parsedData.map((server: any) => ({
                ...server,
                notesVisible: server.notesVisible === true // Explicitly check for true, defaults to false
              }));
              console.log('Loaded servers from localStorage with updated notesVisible flags:', updatedServers);
              setStorageType('localStorage');
              setServers(updatedServers);
              console.log("Data loaded from localStorage");
            }
          } catch (e) {
            console.error("Error loading fallback data from localStorage", e);
          }
        }
        
        // Get color palette
        const paletteData = await getPaletteFromIndexedDB();
        if (paletteData) {
          setColorPalette(paletteData);
          applyColorPalette(paletteData);
        } else {
          applyColorPalette(defaultPalette);
        }
        
        // Get user preferences
        const preferencesData = await getPreferencesFromIndexedDB();
        if (preferencesData && preferencesData.sortBy) {
          setSortBy(preferencesData.sortBy);
          console.log("Sort preference loaded:", preferencesData.sortBy);
        }
        
        setDataLoaded(true);
      } catch (e) {
        console.error("Error during initial data load", e);
        setDataLoaded(true);
      }
    };

    loadData();
  }, []);
  
  // Save to IndexedDB whenever servers change, but only after initial data load
  useEffect(() => {
    // Don't save until the initial data is loaded
    if (!dataLoaded) {
      console.log('Data not yet loaded, skipping save');
      return;
    }
    
    console.log('Servers state changed, saving to IndexedDB:', servers);
    
    const saveData = async () => {
      try {
        const success = await saveToIndexedDB(servers);
        if (success) {
          console.log('Successfully saved data to IndexedDB');
        } else {
          console.error('Failed to save to IndexedDB');
          
          // Try fallback to localStorage
          try {
            localStorage.setItem('dashboard_servers', JSON.stringify(servers));
            console.log('Fallback save to localStorage successful');
          } catch (storageError) {
            console.error('Fallback save to localStorage failed:', storageError);
          }
        }
      } catch (error) {
        console.error('Error during save operation:', error);
      }
    };
    
    saveData();
  }, [servers, dataLoaded]);

  const handleAddServer = () => {
    if (!newServer.name || !newServer.hostname) {
      alert('Please enter both server name and hostname');
      return;
    }

    console.log('Adding new server with notesVisible defaulting to false');

    const server: Server = {
      id: Date.now().toString(),
      name: newServer.name,
      hostname: newServer.hostname,
      services: [],
      notes: newServer.notes,
      notesVisible: false // Always false by default
    };

    setServers([...servers, server]);
    setNewServer({ name: '', hostname: '', notes: '', notesVisible: false });
    setIsDialogOpen(false);
  };

  const openEditServerDialog = (serverId: string) => {
    const server = servers.find((s: Server) => s.id === serverId);
    if (server) {
      // Debug checking state
      console.log('Opening edit dialog for server:', server.id, 'notesVisible:', server.notesVisible);
      
      setNewServer({ 
        name: server.name, 
        hostname: server.hostname, 
        notes: server.notes || '', 
        notesVisible: server.notesVisible || false // Use direct value with fallback to false
      });
      setEditingServerId(serverId);
      setIsEditingServer(true);
      setIsDialogOpen(true);
    }
  };

  const handleEditServer = () => {
    if (!newServer.name || !newServer.hostname || !editingServerId) {
      alert('Please enter both server name and hostname');
      return;
    }

    // Log the actual boolean value for clarity
    const notesVisibleValue = Boolean(newServer.notesVisible);
    console.log('Saving server with notesVisible:', notesVisibleValue, '(original value:', newServer.notesVisible, ', type:', typeof newServer.notesVisible, ')');

    setServers(servers.map((server: Server) => {
      if (server.id === editingServerId) {
        const updatedServer = {
          ...server,
          name: newServer.name,
          hostname: newServer.hostname,
          notes: newServer.notes,
          notesVisible: notesVisibleValue
        };
        console.log('Updated server:', updatedServer.id, 'notesVisible set to:', updatedServer.notesVisible);
        return updatedServer;
      }
      return server;
    }));

    setNewServer({ name: '', hostname: '', notes: '', notesVisible: false });
    setIsDialogOpen(false);
    setIsEditingServer(false);
    setEditingServerId(null);
    showNotification("Server updated successfully");
  };

  const handleDeleteServer = (serverId: string) => {
    if (confirm('Are you sure you want to delete this server?')) {
      setServers(servers.filter((server: Server) => server.id !== serverId));
    }
  };

  // @ts-ignore - used for toggling notes visibility
  const toggleNotesVisibility = (serverId: string) => {
    setServers(servers.map((server: Server) => {
      if (server.id === serverId) {
        const newVisibility = !server.notesVisible;
        console.log('Toggling notes visibility for server:', server.id, 'from:', server.notesVisible, 'to:', newVisibility);
        return {
          ...server,
          notesVisible: newVisibility
        };
      }
      return server;
    }));
  };

  const handleAddService = () => {
    if (!newService.name || !newService.port || !currentServerId) {
      alert('Please enter service name and port');
      return;
    }

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      port: parseInt(newService.port),
      path: newService.path || undefined,
      notes: newService.notes || undefined
    };

    setServers(servers.map((server: Server) => {
      if (server.id === currentServerId) {
        return {
          ...server,
          services: [...server.services, service]
        };
      }
      return server;
    }));

    setNewService({ name: '', port: '', path: '', notes: '' });
    setIsAddingService(false);
  };

  const handleDeleteService = (serverId: string, serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServers(servers.map((server: Server) => {
        if (server.id === serverId) {
          return {
            ...server,
            services: server.services.filter(service => service.id !== serviceId)
          };
        }
        return server;
      }));
    }
  };

  const openEditServiceDialog = (serverId: string, serviceId: string) => {
    const server = servers.find(s => s.id === serverId);
    if (server) {
      const service = server.services.find(s => s.id === serviceId);
      if (service) {
        setCurrentServerId(serverId);
        setEditingServiceId(serviceId);
        setNewService({
          name: service.name,
          port: service.port.toString(),
          path: service.path || '',
          notes: service.notes || ''
        });
        setIsEditingService(true);
        setIsAddingService(true);
      }
    }
  };

  const handleEditService = () => {
    if (!newService.name || !newService.port || !currentServerId || !editingServiceId) {
      alert('Please enter service name and port');
      return;
    }

    setServers(servers.map((server: Server) => {
      if (server.id === currentServerId) {
        return {
          ...server,
          services: server.services.map(service => {
            if (service.id === editingServiceId) {
              return {
                ...service,
                name: newService.name,
                port: parseInt(newService.port),
                path: newService.path || undefined,
                notes: newService.notes || undefined
              };
            }
            return service;
          })
        };
      }
      return server;
    }));

    setNewService({ name: '', port: '', path: '', notes: '' });
    setIsAddingService(false);
    setIsEditingService(false);
    setEditingServiceId(null);
    showNotification("Service updated successfully");
  };

  // Apply color palette changes in real-time
  useEffect(() => {
    applyColorPalette(colorPalette);
  }, [colorPalette]);

  // Reset palette to defaults and save them
  const resetPalette = async () => {
    try {
      // Set the palette to defaults
      setColorPalette(defaultPalette);
      
      // Immediately apply the default colors
      applyColorPalette(defaultPalette);
      
      // Save the default palette to storage
      const success = await savePaletteToIndexedDB(defaultPalette);
      
      if (success) {
        setIsPaletteDialogOpen(false);
        showNotification("Default colors restored and saved");
      } else {
        alert("Failed to save default colors");
      }
    } catch (err) {
      console.error("Error resetting palette:", err);
      alert("Error resetting to defaults");
    }
  };

  // Handle cancelling the palette dialog
  const cancelPaletteDialog = async () => {
    try {
      // Try to get the saved palette from IndexedDB
      const storedPalette = await getPaletteFromIndexedDB();
      
      if (storedPalette) {
        // If there's a stored palette, use it
        setColorPalette(storedPalette);
        applyColorPalette(storedPalette);
      } else {
        // If no stored palette, use defaults
        setColorPalette(defaultPalette);
        applyColorPalette(defaultPalette);
      }
      
      // Close the dialog
      setIsPaletteDialogOpen(false);
    } catch (err) {
      console.error("Error cancelling dialog:", err);
      
      // On error, revert to defaults
      setColorPalette(defaultPalette);
      applyColorPalette(defaultPalette);
      setIsPaletteDialogOpen(false);
    }
  };

  // Function to save color palette
  const savePalette = async () => {
    try {
      // Save current palette to IndexedDB
      const success = await savePaletteToIndexedDB(colorPalette);
      
      if (success) {
        // Apply the colors and close the dialog
        applyColorPalette(colorPalette);
        setIsPaletteDialogOpen(false);
        showNotification("Color settings saved successfully");
      } else {
        alert("Failed to save color settings");
      }
    } catch (err) {
      console.error("Error saving palette:", err);
      alert("Error saving color settings");
    }
  };

  // Function to apply color palette to CSS variables
  const applyColorPalette = (palette: ColorPalette) => {
    // Background colors
    document.documentElement.style.setProperty('--header-background', palette.headerBackground);
    document.documentElement.style.setProperty('--page-background', palette.pageBackground);
    document.documentElement.style.setProperty('--server-background', palette.serverBackground);
    document.documentElement.style.setProperty('--service-background', palette.serviceBackground);
    
    // Text colors
    document.documentElement.style.setProperty('--server-text', palette.serverText);
    document.documentElement.style.setProperty('--service-text', palette.serviceText);
    document.documentElement.style.setProperty('--secondary-text', palette.secondaryText);
    document.documentElement.style.setProperty('--accent-text', palette.serviceText);
    
    // Button colors
    document.documentElement.style.setProperty('--primary-button', palette.accentButton);
    document.documentElement.style.setProperty('--accent-button', palette.accentButton);
    document.documentElement.style.setProperty('--secondary-button', palette.secondaryButton);
    document.documentElement.style.setProperty('--primary-button-text', palette.primaryButtonText);
    document.documentElement.style.setProperty('--secondary-button-text', palette.secondaryButtonText);
    
    // Set hover states using color-mix for better visual effects
    document.documentElement.style.setProperty('--accent-text-hover', `color-mix(in srgb, ${palette.serviceText} 85%, white)`);
    document.documentElement.style.setProperty('--primary-button-hover', `color-mix(in srgb, ${palette.accentButton} 85%, white)`);
    document.documentElement.style.setProperty('--secondary-button-hover', `color-mix(in srgb, ${palette.secondaryButton} 85%, white)`);
    
    // Status colors
    document.documentElement.style.setProperty('--status-red', palette.statusRed);
    document.documentElement.style.setProperty('--status-amber', palette.statusAmber);
    document.documentElement.style.setProperty('--status-green', palette.statusGreen);
  };

  // Handle color change in palette
  const handleColorChange = (key: keyof ColorPalette, value: string) => {
    // Validate that the value is a valid hex color
    if (value.match(/^#([0-9A-F]{3}){1,2}$/i) || value === '') {
      setColorPalette(prev => ({
        ...prev,
        [key]: value || '#000000' // Fallback to black if empty
      }));
    } else if (value.length <= 7) {
      // Allow partial input while typing
      setColorPalette(prev => ({
        ...prev,
        [key]: value
      }));
    }
    // Ignore invalid inputs that don't match the pattern
  };

  // Include color palette in export data
  const exportData = () => {
    try {
      const dataToExport = {
        servers,
        colorPalette,
        preferences: {
          sortBy
        }
      };
      
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'homni-dashboard-export.json';
      a.click();
      
      URL.revokeObjectURL(url);
      showNotification("Data exported successfully");
    } catch (e) {
      console.error("Export failed", e);
      alert("Export failed");
    }
  };

  // Import data including color palette and preferences
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          
          if (Array.isArray(parsedData.servers)) {
            await saveToIndexedDB(parsedData.servers);
            setServers(parsedData.servers);
            
            if (parsedData.colorPalette) {
              await savePaletteToIndexedDB(parsedData.colorPalette);
              setColorPalette(parsedData.colorPalette);
              applyColorPalette(parsedData.colorPalette);
            }
            
            if (parsedData.preferences && parsedData.preferences.sortBy) {
              await savePreferencesToIndexedDB({ sortBy: parsedData.preferences.sortBy });
              setSortBy(parsedData.preferences.sortBy);
            }
            
            showNotification("Data imported successfully");
          } else if (Array.isArray(parsedData)) {
            // Legacy import (servers only)
            await saveToIndexedDB(parsedData);
            setServers(parsedData);
            showNotification("Data imported successfully");
          } else {
            throw new Error("Invalid import format");
          }
        } catch (parseError) {
          console.error("Import parsing failed", parseError);
          alert("Import failed: Invalid file format");
        }
      };
      
      reader.onerror = () => {
        alert("Error reading file");
      };
      
      reader.readAsText(file);
    } catch (e) {
      console.error("Import failed", e);
      alert("Import failed");
    }
    
    // Reset the input
    event.target.value = '';
  };

  const openServiceDialog = (serverId: string) => {
    setCurrentServerId(serverId);
    setIsAddingService(true);
  };

  const getSortedServers = () => {
    // Return servers in a more balanced order for the masonry layout
    // Instead of alphabetical sorting, which can lead to uneven column heights
    if (searchTerm) {
      // If searching, maintain the default behavior
      return [...servers].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Create a copy of the servers array
    const serversCopy = [...servers];
    
    // Sort by number of services (most services first)
    // This helps distribute tall cards more evenly
    return serversCopy.sort((a, b) => b.services.length - a.services.length);
  };

  const getSortedServices = (services: Service[]) => {
    return [...services].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.port - b.port;
      }
    });
  };

  return (
    <div className="plex-app">
      <div className="header">
        <div className="header-logo">
          <div className="app-logo"></div>
          <h1>Homni</h1>
        </div>
        
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search servers or services..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search servers or services"
                className="search-input"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="search-clear-button" 
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </form>
        </div>

        <button 
          className="header-palette-button" 
          onClick={() => setIsPaletteDialogOpen(true)}
          title="Customize Colors (Alt+P)"
        >
          <div className="header-palette-icon"></div>
        </button>
      </div>
      
      {notification.show && (
        <div className="save-notification">
          <span>{notification.message}</span>
        </div>
      )}
      
      <div className="container">
        {(searchTerm && getFilteredServers().length === 0) && (
          <div className="search-status">
            <p>No results found for "{searchTerm}"</p>
            <button className="text-button" onClick={clearSearch}>Clear search</button>
          </div>
        )}
        
        {searchTerm && getFilteredServers().length > 0 && (
          <div className="search-status">
            {servers.some(server => 
              server.services.some(service => 
                service.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
            ) ? (
              <p>Showing servers with services matching "{searchTerm}"</p>
            ) : (
              <p>Showing servers matching "{searchTerm}"</p>
            )}
            <button className="text-button" onClick={clearSearch}>Clear search</button>
          </div>
        )}
        
        {servers.length === 0 && !searchTerm ? (
          <div className="welcome-section">
            <div className="card">
              <h2>👋&nbsp;&nbsp;Welcome to Homni</h2>
              
              <p className="welcome-intro"><strong>Your personal dashboard</strong> for managing and accessing self-hosted services across multiple servers.</p>
              
              <div className="privacy-note">
                <p><em>Homni respects your privacy:</em> All data is stored securely in your browser only — nothing is ever sent or shared with the internet.</p>
                
                <p>You can export your configuration and take it with you anywhere. If you already have a configuration file, use the Import button below. Otherwise, <em>click Add Server to get started.</em></p>
              </div>
              
              <div className="welcome-buttons">
                <button 
                  className="add-button" 
                  onClick={() => setIsDialogOpen(true)}
                  title="Add Server (Alt+A)"
                >
                  Add Server
                </button>
                <input
                  type="file"
                  id="welcome-import-file"
                  accept=".json"
                  onChange={importData}
                  style={{ display: 'none' }}
                />
                <button 
                  className="btn-secondary" 
                  onClick={() => document.getElementById('welcome-import-file')?.click()}
                  title="Import data (Alt+I)"
                >
                  Import
                </button>
              </div>
              
              <div className="keyboard-shortcuts-info">
                <h3>Keyboard Shortcuts</h3>
                <div className="keyboard-shortcuts-grid">
                  <div className="shortcut-item">
                    <div className="shortcut-keys">
                      <kbd>Alt</kbd> + <kbd>A</kbd>
                    </div>
                    <p className="shortcut-description">Add Server</p>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-keys">
                      <kbd>Alt</kbd> + <kbd>I</kbd>
                    </div>
                    <p className="shortcut-description">Import Data</p>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-keys">
                      <kbd>Alt</kbd> + <kbd>E</kbd>
                    </div>
                    <p className="shortcut-description">Export Data</p>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-keys">
                      <kbd>Alt</kbd> + <kbd>P</kbd>
                    </div>
                    <p className="shortcut-description">Customize Colors</p>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-keys">
                      <kbd>/</kbd> or <kbd>Alt</kbd> + <kbd>S</kbd>
                    </div>
                    <p className="shortcut-description">Focus Search</p>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-keys">
                      <kbd>Esc</kbd>
                    </div>
                    <p className="shortcut-description">Clear Search / Close Dialog</p>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-keys">
                      <kbd>Enter</kbd>
                    </div>
                    <p className="shortcut-description">Submit Form or Navigate Forms</p>
                  </div>
                  <div className="shortcut-item">
                    <div className="shortcut-keys">
                      <kbd>Tab</kbd>
                    </div>
                    <p className="shortcut-description">Navigate Between Fields</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="section-header">
              <div className="section-buttons">
                <button 
                  className="add-button" 
                  onClick={() => setIsDialogOpen(true)}
                  title="Add Server (Alt+A)"
                >
                  Add Server
                </button>
                <input
                  type="file"
                  id="section-import-file"
                  accept=".json"
                  onChange={importData}
                  style={{ display: 'none' }}
                />
                <button 
                  className="btn-secondary" 
                  onClick={() => document.getElementById('section-import-file')?.click()}
                  title="Import data (Alt+I)"
                >
                  Import
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={exportData} 
                  title="Export data (Alt+E)"
                >
                  Export
                </button>
              </div>
              <div className="sorting-options">
                <span className="secondary-text">Sort services by:</span>
                <div className="sort-buttons">
                  <button 
                    className={`sort-button ${sortBy === 'name' ? 'active' : ''}`} 
                    onClick={() => {
                      setSortBy('name');
                      savePreferencesToIndexedDB({ sortBy: 'name' });
                    }}
                    aria-pressed={sortBy === 'name'}
                  >
                    Name
                  </button>
                  <button 
                    className={`sort-button ${sortBy === 'port' ? 'active' : ''}`} 
                    onClick={() => {
                      setSortBy('port');
                      savePreferencesToIndexedDB({ sortBy: 'port' });
                    }}
                    aria-pressed={sortBy === 'port'}
                  >
                    Port
                  </button>
                </div>
              </div>
            </div>
            
            <FlexGrid className="servers-grid">
              {getFilteredServers().map(server => (
                <div className="server-card" key={server.id}>
                  <div className="server-header">
                    <h2>{server.name}</h2>
                    <div className="server-actions">
                      <button 
                        className="small-button" 
                        onClick={() => openServiceDialog(server.id)}
                        title="Add Service"
                      >
                        Add Service
                      </button>
                    </div>
                  </div>
                  
                  <div className="server-hostname-container">
                    <div 
                      className="config-icon" 
                      onClick={() => openEditServerDialog(server.id)}
                      title="Edit Server Settings"
                    ></div>
                    <p className="server-hostname">{server.hostname}</p>
                  </div>

                  {server.notes && server.notesVisible && (
                    <div className="server-notes">{server.notes}</div>
                  )}
                  
                  {server.services.length > 0 ? (
                    <div className="services-list">
                      {getSortedServices(getFilteredServices(server.services)).map(service => (
                        <div className="service-wrapper" key={service.id}>
                          <div 
                            className="config-icon" 
                            onClick={() => openEditServiceDialog(server.id, service.id)}
                            title="Edit Service Settings"
                          ></div>
                          <a 
                            href={`http://${server.hostname}:${service.port}${service.path || ''}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="service-link"
                            title={`Open ${service.name} (Port ${service.port})`}
                          >
                            <div className="service-item">
                              <span className="service-name">{service.name}</span>
                              <div className="service-port-container">
                                <span className="service-port">:{service.port}</span>
                              </div>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-services">No services added yet</p>
                  )}
                </div>
              ))}
            </FlexGrid>
          </>
        )}
      </div>

      {/* Server Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="dialog" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsDialogOpen(false);
            setIsEditingServer(false);
          }
        }}>
          <div className="dialog-content" ref={serverDialogRef}>
            <h2 className="dialog-title">{isEditingServer ? 'Edit Server' : 'Add Server'}</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (isEditingServer) {
                handleEditServer();
              } else {
                handleAddServer();
              }
            }}>
              <div className="form-group">
                <label htmlFor="serverName">Server Name</label>
                <input
                  type="text"
                  id="serverName"
                  value={newServer.name}
                  onChange={(e) => setNewServer({...newServer, name: e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="e.g. Home Server"
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="serverHostname">Hostname or IP</label>
                <input
                  type="text"
                  id="serverHostname"
                  value={newServer.hostname}
                  onChange={(e) => setNewServer({...newServer, hostname: e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="e.g. 192.168.1.100 or server.local"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="serverNotes">Notes (optional)</label>
                <textarea
                  id="serverNotes"
                  value={newServer.notes || ''}
                  onChange={(e) => setNewServer({...newServer, notes: e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Add any notes about this server..."
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={!!newServer.notesVisible}
                    onChange={(e) => setNewServer({...newServer, notesVisible: e.target.checked})}
                  />
                  <span>&nbsp;&nbsp;Show notes on dashboard</span>
                </label>
              </div>
              
              <div className="dialog-actions">
                {isEditingServer && (
                  <button 
                    type="button" 
                    className="btn btn-delete"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this server?')) {
                        handleDeleteServer(editingServerId!);
                        setIsDialogOpen(false);
                        setIsEditingServer(false);
                      }
                    }}
                  >
                    Delete Server
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-cancel"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setIsEditingServer(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditingServer ? 'Save Changes' : 'Add Server'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Service Add/Edit Dialog */}
      {isAddingService && (
        <div className="dialog" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsAddingService(false);
            setIsEditingService(false);
          }
        }}>
          <div className="dialog-content" ref={serviceDialogRef}>
            <h2 className="dialog-title">{isEditingService ? 'Edit Service' : 'Add Service'}</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (isEditingService) {
                handleEditService();
              } else {
                handleAddService();
              }
            }}>
              <div className="form-group">
                <label htmlFor="serviceName">Service Name</label>
                <input
                  type="text"
                  id="serviceName"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="e.g. Plex"
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="servicePort">Port</label>
                <input
                  type="number"
                  id="servicePort"
                  value={newService.port || ''}
                  onChange={(e) => setNewService({...newService, port: e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="e.g. 32400"
                  required
                  min="1"
                  max="65535"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="servicePath">Path (optional)</label>
                <input
                  type="text"
                  id="servicePath"
                  value={newService.path || ''}
                  onChange={(e) => setNewService({...newService, path: e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="e.g. /web or /admin"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="serviceNotes">Notes (optional)</label>
                <textarea
                  id="serviceNotes"
                  value={newService.notes || ''}
                  onChange={(e) => setNewService({...newService, notes: e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder="Add any notes about this service..."
                />
              </div>
              
              <div className="dialog-actions">
                {isEditingService && (
                  <button 
                    type="button" 
                    className="btn btn-delete"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this service?')) {
                        handleDeleteService(currentServerId!, editingServiceId!);
                        setIsAddingService(false);
                        setIsEditingService(false);
                      }
                    }}
                  >
                    Delete Service
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-cancel"
                  onClick={() => {
                    setIsAddingService(false);
                    setIsEditingService(false);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditingService ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Color Palette Dialog */}
      {isPaletteDialogOpen && (
        <div className="dialog" onClick={(e) => {
          if (e.target === e.currentTarget) {
            cancelPaletteDialog();
          }
        }}>
          <div className="dialog-content palette-dialog-content" ref={paletteDialogRef}>
            <h2 className="dialog-title">Color Palette</h2>
            <p>Select a theme or choose your own adventure! 🎨</p>
            
            <div className="theme-selector">
              <button 
                className="theme-button dark-theme-button" 
                onClick={() => applyTheme('dark')}
                title="Dark Theme"
              >
                <div className="theme-preview dark-theme-preview">
                  <div className="theme-header"></div>
                  <div className="theme-server">
                    <div className="theme-accent"></div>
                    <div className="theme-secondary"></div>
                  </div>
                </div>
                <span>Dark Theme</span>
              </button>
              
              <button 
                className="theme-button light-theme-button" 
                onClick={() => applyTheme('light')}
                title="Light Theme"
              >
                <div className="theme-preview light-theme-preview">
                  <div className="theme-header"></div>
                  <div className="theme-server">
                    <div className="theme-accent"></div>
                    <div className="theme-secondary"></div>
                  </div>
                </div>
                <span>Light Theme</span>
              </button>
            </div>
            
            <div className="color-categories simplified">
              <div className="color-picker-container">
                <span className="color-picker-label">Header Background</span>
                <input 
                  type="color" 
                  value={colorPalette.headerBackground} 
                  onChange={(e) => handleColorChange('headerBackground', e.target.value)}
                  title="Header Background"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.headerBackground}
                  onChange={(e) => handleColorChange('headerBackground', e.target.value)}
                />
              </div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Page Background</span>
                <input 
                  type="color" 
                  value={colorPalette.pageBackground} 
                  onChange={(e) => handleColorChange('pageBackground', e.target.value)}
                  title="Page Background"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.pageBackground}
                  onChange={(e) => handleColorChange('pageBackground', e.target.value)}
                />
              </div>
              
              <div className="color-picker-spacer"></div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Server Card</span>
                <input 
                  type="color" 
                  value={colorPalette.serverBackground} 
                  onChange={(e) => handleColorChange('serverBackground', e.target.value)}
                  title="Server Card"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.serverBackground}
                  onChange={(e) => handleColorChange('serverBackground', e.target.value)}
                />
              </div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Service Card</span>
                <input 
                  type="color" 
                  value={colorPalette.serviceBackground} 
                  onChange={(e) => handleColorChange('serviceBackground', e.target.value)}
                  title="Service Card"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.serviceBackground}
                  onChange={(e) => handleColorChange('serviceBackground', e.target.value)}
                />
              </div>
              
              <div className="color-picker-spacer"></div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Primary Button & Text</span>
                <input 
                  type="color" 
                  value={colorPalette.accentButton} 
                  onChange={(e) => handleColorChange('accentButton', e.target.value)}
                  title="Primary Button"
                />
                <input 
                  type="color" 
                  value={colorPalette.primaryButtonText} 
                  onChange={(e) => handleColorChange('primaryButtonText', e.target.value)}
                  title="Primary Button Text"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.accentButton}
                  onChange={(e) => handleColorChange('accentButton', e.target.value)}
                />
              </div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Secondary Button & Text</span>
                <input 
                  type="color" 
                  value={colorPalette.secondaryButton} 
                  onChange={(e) => handleColorChange('secondaryButton', e.target.value)}
                  title="Secondary Button"
                />
                <input 
                  type="color" 
                  value={colorPalette.secondaryButtonText} 
                  onChange={(e) => handleColorChange('secondaryButtonText', e.target.value)}
                  title="Secondary Button Text"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.secondaryButton}
                  onChange={(e) => handleColorChange('secondaryButton', e.target.value)}
                />
              </div>
              
              <div className="color-picker-spacer"></div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Accent Text</span>
                <input 
                  type="color" 
                  value={colorPalette.serviceText} 
                  onChange={(e) => handleColorChange('serviceText', e.target.value)}
                  title="Accent Text"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.serviceText}
                  onChange={(e) => handleColorChange('serviceText', e.target.value)}
                />
              </div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Primary Text</span>
                <input 
                  type="color" 
                  value={colorPalette.serverText} 
                  onChange={(e) => handleColorChange('serverText', e.target.value)}
                  title="Primary Text"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.serverText}
                  onChange={(e) => handleColorChange('serverText', e.target.value)}
                />
              </div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Secondary Text</span>
                <input 
                  type="color" 
                  value={colorPalette.secondaryText} 
                  onChange={(e) => handleColorChange('secondaryText', e.target.value)}
                  title="Secondary Text"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.secondaryText}
                  onChange={(e) => handleColorChange('secondaryText', e.target.value)}
                />
              </div>
              
              <div className="color-picker-spacer"></div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Red Status</span>
                <input 
                  type="color" 
                  value={colorPalette.statusRed} 
                  onChange={(e) => handleColorChange('statusRed', e.target.value)}
                  title="Red Status"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.statusRed}
                  onChange={(e) => handleColorChange('statusRed', e.target.value)}
                />
              </div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Amber Status</span>
                <input 
                  type="color" 
                  value={colorPalette.statusAmber} 
                  onChange={(e) => handleColorChange('statusAmber', e.target.value)}
                  title="Amber Status"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.statusAmber}
                  onChange={(e) => handleColorChange('statusAmber', e.target.value)}
                />
              </div>
              
              <div className="color-picker-container">
                <span className="color-picker-label">Green Status</span>
                <input 
                  type="color" 
                  value={colorPalette.statusGreen} 
                  onChange={(e) => handleColorChange('statusGreen', e.target.value)}
                  title="Green Status"
                />
                <input 
                  type="text" 
                  className="color-picker-input" 
                  value={colorPalette.statusGreen}
                  onChange={(e) => handleColorChange('statusGreen', e.target.value)}
                />
              </div>
            </div>
            
            <div className="palette-actions">
              <button 
                className="btn btn-reset"
                onClick={resetPalette}
                title="Reset to default colors"
              >
                Reset to Default
              </button>
              
              <div className="palette-action-buttons">
                <button 
                  className="btn btn-cancel"
                  onClick={cancelPaletteDialog}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={savePalette}
                >
                  Save Colors
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="footer">
        <div className="footer-logo"></div>
        <span>Homni, a passion project by James Forwood. © {new Date().getFullYear()} All Rights Reserved.</span>
      </div>
    </div>
  );
}

export default App;
