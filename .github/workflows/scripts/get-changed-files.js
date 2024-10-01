// identify-modified-services.js
const fs = require('fs');
const path = require('path');

const basePath = path.resolve('packages');
const serviceDirs = fs.readdirSync(basePath).filter(dir => dir.startsWith('service-'));

console.log('Found services:', serviceDirs);

const changedFiles = JSON.parse(process.env.CHANGED_FILES || '[]');
console.log('Changed files:', changedFiles);

const modifiedServices = serviceDirs.filter(service =>
  changedFiles.some(file => file.startsWith(`packages/${service}`))
);

console.log('Modified services:', modifiedServices);

console.log(`::set-output name=modifiedServices::${JSON.stringify(modifiedServices)}`);
