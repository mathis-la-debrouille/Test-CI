// get-changed-files.js
const fs = require('fs');
const path = require('path');

// Find directories starting with 'service-' in 'packages'
const basePath = path.resolve('packages');
const serviceDirs = fs.readdirSync(basePath).filter(dir => dir.startsWith('service-'));

console.log('Found services:', serviceDirs);

// Load the list of changed files from the environment variable
let changedFiles = process.env.CHANGED_FILES || '[]';
try {
  changedFiles = JSON.parse(changedFiles);
  if (!Array.isArray(changedFiles)) {
    throw new Error('CHANGED_FILES is not an array');
  }
} catch (error) {
  console.error('Failed to parse CHANGED_FILES:', error);
  changedFiles = [];
}

console.log('Changed files:', changedFiles);

// Determine which services have been modified
const modifiedServices = serviceDirs.filter(service =>
  changedFiles.some(file => file.startsWith(`packages/${service}`))
);

console.log('Modified services:', modifiedServices);

// Output the result as a JSON string for GitHub Actions
console.log(`::set-output name=modifiedServices::${JSON.stringify(modifiedServices)}`);
