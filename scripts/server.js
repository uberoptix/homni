// Simple HTTP server for local development
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
  // Get the file path
  let filePath = '.' + req.url;
  
  // Remove query parameters for file reading
  filePath = filePath.split('?')[0];
  
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Special route for notes-fix tool
  if (req.url === '/fix-notes' || req.url === '/fix-notes/') {
    filePath = './source/tools/fix-notes-visibility.html';
  }
  
  // Add redirects for documentation files moved to docs directory
  if (req.url === '/RELEASE_NOTES.md' || req.url === '/release-notes') {
    filePath = './docs/RELEASE_NOTES.md';
  }
  
  if (req.url === '/PRD.md' || req.url === '/prd') {
    filePath = './docs/PRD.md';
  }
  
  // Handle command scripts from the scripts directory
  if (req.url === '/start' || req.url === '/start.command') {
    filePath = './scripts/start.command';
  }
  
  if (req.url === '/stop' || req.url === '/stop.command') {
    filePath = './scripts/stop.command';
  }

  // Get the file extension
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile('./index.html', (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success - Add no-cache headers for CSS files to prevent browser caching
      const headers = { 'Content-Type': contentType };
      
      if (extname === '.css') {
        headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';
      }
      
      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
}); 