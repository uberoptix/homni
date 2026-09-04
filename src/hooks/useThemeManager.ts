import { useState, useEffect, useCallback } from 'react';
import { getPaletteFromIndexedDB, savePaletteToIndexedDB } from '../db';

// Type definitions (consider moving to a dedicated types.ts if used elsewhere)
export interface ColorPalette {
  headerBackground: string;
  pageBackground: string;
  serverBackground: string;
  serviceBackground: string;
  serverText: string;
  serviceText: string;
  secondaryText: string;
  accentButton: string;
  secondaryButton: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  statusRed: string;
  statusAmber: string;
  statusGreen: string;
}

// Default color palettes
export const defaultDarkPalette: ColorPalette = {
  headerBackground: '#101010',
  pageBackground: '#202020',
  serverBackground: '#181818',
  serviceBackground: '#202020',
  serverText: '#FFFFFF',
  serviceText: '#DBA33A',
  secondaryText: '#919191',
  accentButton: '#C17F33',
  secondaryButton: '#535353',
  primaryButtonText: '#FFFFFF',
  secondaryButtonText: '#FFFFFF',
  statusRed: '#EC6141',
  statusAmber: '#DBA33A',
  statusGreen: '#7BB961'
};

export const defaultLightPalette: ColorPalette = {
  headerBackground: '#E9FDF1',
  pageBackground: '#F2F2F2',
  serverBackground: '#FFFFFF',
  serviceBackground: '#C9CFD1',
  serverText: '#2C3E50',
  serviceText: '#00a82d',
  secondaryText: '#7D7D7D',
  accentButton: '#00a82d',
  secondaryButton: '#C9CFD1',
  primaryButtonText: '#FFFFFF',
  secondaryButtonText: '#2C3E50',
  statusRed: '#EC6141',
  statusAmber: '#DBA33A',
  statusGreen: '#7BB961'
};

// Helper to apply colors to DOM
const applyColorPaletteDOM = (palette: ColorPalette) => {
  document.documentElement.style.setProperty('--header-background', palette.headerBackground);
  document.documentElement.style.setProperty('--page-background', palette.pageBackground);
  document.documentElement.style.setProperty('--server-background', palette.serverBackground);
  document.documentElement.style.setProperty('--service-background', palette.serviceBackground);
  document.documentElement.style.setProperty('--server-text', palette.serverText);
  document.documentElement.style.setProperty('--service-text', palette.serviceText);
  document.documentElement.style.setProperty('--secondary-text', palette.secondaryText);
  document.documentElement.style.setProperty('--accent-text', palette.serviceText);
  document.documentElement.style.setProperty('--primary-button', palette.accentButton);
  document.documentElement.style.setProperty('--accent-button', palette.accentButton);
  document.documentElement.style.setProperty('--secondary-button', palette.secondaryButton);
  document.documentElement.style.setProperty('--primary-button-text', palette.primaryButtonText);
  document.documentElement.style.setProperty('--secondary-button-text', palette.secondaryButtonText);
  document.documentElement.style.setProperty('--accent-text-hover', `color-mix(in srgb, ${palette.serviceText} 85%, white)`);
  document.documentElement.style.setProperty('--primary-button-hover', `color-mix(in srgb, ${palette.accentButton} 85%, white)`);
  document.documentElement.style.setProperty('--secondary-button-hover', `color-mix(in srgb, ${palette.secondaryButton} 85%, white)`);
  document.documentElement.style.setProperty('--status-red', palette.statusRed);
  document.documentElement.style.setProperty('--status-amber', palette.statusAmber);
  document.documentElement.style.setProperty('--status-green', palette.statusGreen);
};


export const useThemeManager = (showNotification: (message: string) => void) => {
  const [appliedPalette, setAppliedPalette] = useState<ColorPalette>(defaultLightPalette);
  const [dialogPalette, setDialogPalette] = useState<ColorPalette>(defaultLightPalette);
  const [isPaletteDialogOpen, setIsPaletteDialogOpen] = useState(false);
  const [isPaletteLoading, setIsPaletteLoading] = useState(true);

  // Load initial palette from IndexedDB
  useEffect(() => {
    const loadInitialPalette = async () => {
      setIsPaletteLoading(true);
      try {
        const storedPalette = await getPaletteFromIndexedDB();
        if (storedPalette) {
          setAppliedPalette(storedPalette);
          setDialogPalette(storedPalette); // Initialize dialog palette too
        } else {
          // If no stored palette, apply and set the default (light)
          setAppliedPalette(defaultLightPalette);
          setDialogPalette(defaultLightPalette);
        }
      } catch (error) {
        console.error("Failed to load palette from IndexedDB", error);
        // Fallback to default if error
        setAppliedPalette(defaultLightPalette);
        setDialogPalette(defaultLightPalette);
      } finally {
        setIsPaletteLoading(false);
      }
    };
    loadInitialPalette();
  }, []);

  // Apply palette to DOM when it changes
  useEffect(() => {
    if (!isPaletteLoading) {
      applyColorPaletteDOM(appliedPalette);
    }
  }, [appliedPalette, isPaletteLoading]);

  const openPaletteDialog = useCallback(() => {
    setDialogPalette(appliedPalette); // Sync dialog with current applied palette
    setIsPaletteDialogOpen(true);
  }, [appliedPalette]);

  const closePaletteDialog = useCallback(() => {
    setIsPaletteDialogOpen(false);
  }, []);
  
  const cancelPaletteChangesInDialog = useCallback(() => {
    setDialogPalette(appliedPalette); // Revert dialog changes to current applied palette
    setIsPaletteDialogOpen(false);
  }, [appliedPalette]);

  const handleDialogColorChange = useCallback((key: keyof ColorPalette, value: string) => {
    if (value.match(/^#([0-9A-F]{3}){1,2}$/i) || value === '') {
      setDialogPalette(prev => ({ ...prev, [key]: value || '#000000' }));
    } else if (value.length <= 7) {
      setDialogPalette(prev => ({ ...prev, [key]: value }));
    }
  }, []);

  const saveDialogPalette = useCallback(async () => {
    try {
      const success = await savePaletteToIndexedDB(dialogPalette);
      if (success) {
        setAppliedPalette(dialogPalette);
        setIsPaletteDialogOpen(false);
        showNotification("Color settings saved successfully");
      } else {
        showNotification("Failed to save color settings");
      }
    } catch (err) {
      console.error("Error saving palette:", err);
      showNotification("Error saving color settings");
    }
  }, [dialogPalette, showNotification]);

  const switchToTheme = useCallback(async (theme: 'dark' | 'light') => {
    const newPalette = theme === 'dark' ? defaultDarkPalette : defaultLightPalette;
    try {
      const success = await savePaletteToIndexedDB(newPalette);
      if (success) {
        setAppliedPalette(newPalette);
        setDialogPalette(newPalette); // Also update dialog state
        setIsPaletteDialogOpen(false); // Close dialog if open
        showNotification(`${theme === 'dark' ? 'Dark' : 'Light'} theme applied and saved`);
      } else {
        showNotification(`Failed to save ${theme} theme`);
      }
    } catch (err) {
      console.error(`Error switching to ${theme} theme:`, err);
      showNotification(`Error switching to ${theme} theme`);
    }
  }, [showNotification]);
  
  const resetPaletteToDefault = useCallback(async () => {
    // Assuming light is the "main" default to reset to
    const targetPalette = defaultLightPalette;
    try {
      const success = await savePaletteToIndexedDB(targetPalette);
      if (success) {
        setAppliedPalette(targetPalette);
        setDialogPalette(targetPalette);
        setIsPaletteDialogOpen(false);
        showNotification("Default colors restored and saved");
      } else {
        showNotification("Failed to save default colors");
      }
    } catch (err) {
      console.error("Error resetting palette:", err);
      showNotification("Error resetting to defaults");
    }
  }, [showNotification]);

  return {
    appliedPalette, // The currently active and saved palette
    dialogPalette,  // Palette for live editing in the dialog
    isPaletteDialogOpen,
    isPaletteLoading,
    openPaletteDialog,
    closePaletteDialog, // Simple close
    cancelPaletteChangesInDialog, // Close and revert dialog changes
    handleDialogColorChange,
    saveDialogPalette,
    switchToTheme,
    resetPaletteToDefault,
  };
}; 