// get-changed-files.js
const fs = require('fs');
const path = require('path');

// Find directories starting with 'service-' in 'packages'
const basePath = path.resolve('packages');
const serviceDirs = fs.readdirSync(basePath).filter(dir => dir.startsWith('service-'));

console.log('Found services:', serviceDirs);

// Load the list of changed files from the environment variable
let changedFiles = process.env.CHANGED_FILES || '';
console.log("Raw CHANGED_FILES:", changedFiles);

// Split the changedFiles string into an array by spaces
changedFiles = changedFiles.trim().split(/\s+/);

console.log('Changed files as an array:', changedFiles);

// Determine which services have been modified
const modifiedServices = serviceDirs.filter(service =>
  changedFiles.some(file => file.startsWith(`packages/${service}`))
);

console.log('Modified services:', modifiedServices);

// Output the result as a JSON string for GitHub Actions
console.log(`::set-output name=modifiedServices::${JSON.stringify(modifiedServices)}`);
