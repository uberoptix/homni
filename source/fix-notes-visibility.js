/**
 * Homni Dashboard - Service Notes Visibility Fix Utility
 * 
 * This utility checks and fixes issues with service notes visibility,
 * ensuring they're properly supported in both development and production.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Log with color
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`)
};

// Utility functions
function searchInFile(filePath, searchTerms) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {};
    
    for (const term of searchTerms) {
      results[term] = content.includes(term);
    }
    
    return results;
  } catch (err) {
    log.error(`Failed to search in file ${filePath}: ${err.message}`);
    return null;
  }
}

function checkServiceNotesUsage() {
  const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
  
  if (!fs.existsSync(appTsxPath)) {
    log.error(`App.tsx not found at ${appTsxPath}`);
    return false;
  }
  
  log.info('Checking App.tsx for service notes handling...');
  
  const searchTerms = [
    'notes?: string', // Service interface definition
    'notes: service.notes || undefined', // In edit service function
    'notes: newService.notes || undefined', // In add service function
    'notes: newService.notes || \'\'', // In dialog state
    'id="serviceNotes"', // Form field
    'serviceNotes' // Label
  ];
  
  const results = searchInFile(appTsxPath, searchTerms);
  
  if (!results) {
    return false;
  }
  
  let allFound = true;
  for (const [term, found] of Object.entries(results)) {
    if (found) {
      log.success(`Found '${term}' in App.tsx`);
    } else {
      log.warning(`Did not find '${term}' in App.tsx`);
      allFound = false;
    }
  }
  
  return allFound;
}

function fixServiceNotesDialog() {
  const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
  
  try {
    let content = fs.readFileSync(appTsxPath, 'utf8');
    
    // Check for and fix any issues with service dialog form
    if (!content.includes('id="serviceNotes"')) {
      log.info('Service notes textarea not found, adding it to the form...');
      
      // Find the position to insert the notes field (before the dialog-actions div)
      const beforeDialogActions = content.indexOf('<div className="dialog-actions">');
      
      if (beforeDialogActions !== -1) {
        // Find the preceding form field to insert after
        const servicePath = content.lastIndexOf('</div>', beforeDialogActions);
        const servicePathFormGroup = content.lastIndexOf('<div className="form-group">', servicePath);
        
        if (servicePathFormGroup !== -1 && servicePath !== -1) {
          // Insert the notes form field
          const notesField = `
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
              `;
          
          content = content.slice(0, servicePath + 6) + notesField + content.slice(servicePath + 6);
          fs.writeFileSync(appTsxPath, content, 'utf8');
          log.success('Added service notes field to dialog form');
          return true;
        }
      }
      
      log.error('Could not find appropriate location to insert notes field');
      return false;
    } else {
      log.success('Service notes field already exists in dialog form');
      return true;
    }
  } catch (err) {
    log.error(`Failed to fix service notes dialog: ${err.message}`);
    return false;
  }
}

function checkAndUpdateIndexedDBUsage() {
  const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
  
  try {
    const content = fs.readFileSync(appTsxPath, 'utf8');
    
    // Check if Service interface has notes property
    if (!content.includes('notes?: string')) {
      log.error('Service interface is missing the notes property');
      return false;
    }
    
    // Check if edit service has notes handling
    const hasEditServiceNotes = content.includes('notes: service.notes || undefined') || 
                               content.includes('notes: service.notes || ""');
    
    // Check if add service has notes handling
    const hasAddServiceNotes = content.includes('notes: newService.notes || undefined') || 
                              content.includes('notes: newService.notes || ""');
    
    if (!hasEditServiceNotes || !hasAddServiceNotes) {
      log.warning('Service notes may not be properly handled in add/edit functions');
    } else {
      log.success('Service notes are properly handled in add/edit functions');
    }
    
    return true;
  } catch (err) {
    log.error(`Failed to check IndexedDB usage: ${err.message}`);
    return false;
  }
}

// Main execution
try {
  console.log('\n==========================================================');
  log.info('Starting Service Notes Visibility Fix Utility');
  console.log('==========================================================\n');
  
  // Check service notes usage in App.tsx
  const notesUsageOK = checkServiceNotesUsage();
  
  if (!notesUsageOK) {
    log.warning('Issues found with service notes usage');
    
    // Fix service notes dialog
    const dialogFixed = fixServiceNotesDialog();
    
    if (dialogFixed) {
      log.success('Service notes dialog fixed successfully');
    } else {
      log.warning('Could not automatically fix service notes dialog');
    }
  }
  
  // Check and update IndexedDB usage
  const dbUsageOK = checkAndUpdateIndexedDBUsage();
  
  if (!dbUsageOK) {
    log.warning('Issues found with IndexedDB usage');
  }
  
  console.log('\n==========================================================');
  
  if (notesUsageOK && dbUsageOK) {
    log.success('Service notes are properly configured!');
    console.log('==========================================================\n');
    process.exit(0);
  } else {
    log.warning('Some issues with service notes configuration were found.');
    log.info('Please check the logs above and fix any remaining issues manually.');
    console.log('==========================================================\n');
    process.exit(1);
  }
} catch (err) {
  log.error(`Unexpected error: ${err.message}`);
  process.exit(1);
} 