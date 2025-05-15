#!/usr/bin/env node

console.log('\x1b[31m%s\x1b[0m', '❌ DEVELOPMENT SERVER DISABLED');
console.log('\x1b[33m%s\x1b[0m', '-------------------------------------------');
console.log('The development server has been intentionally disabled.');
console.log('');
console.log('\x1b[36m%s\x1b[0m', 'Homni uses a production-only workflow:');
console.log('1. Make changes in the source directory');
console.log('2. Run "./deploy.sh" from the project root');
console.log('3. View your changes at http://localhost:8080');
console.log('');
console.log('\x1b[33m%s\x1b[0m', 'Using separate development/production environments');
console.log('\x1b[33m%s\x1b[0m', 'created synchronization issues, caching problems,');
console.log('\x1b[33m%s\x1b[0m', 'and inconsistent behavior.');
console.log('');
console.log('\x1b[32m%s\x1b[0m', 'Please run: cd /Users/jforwood/Desktop/Homni && ./deploy.sh');
console.log('\x1b[33m%s\x1b[0m', '-------------------------------------------');

process.exit(1); 