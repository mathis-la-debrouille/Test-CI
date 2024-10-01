const fs = require('fs');
const path = require('path');

try {
    const basePath = path.resolve('packages');
    if (!fs.existsSync(basePath)) {
        throw new Error(`The base directory "packages" does not exist at path: ${basePath}`);
    }
  
    const serviceDirs = fs.readdirSync(basePath).filter(dir => dir.startsWith('service-'));

    console.log('Found services:', serviceDirs);

    let changedFiles = process.env.CHANGED_FILES || '';

    changedFiles = changedFiles.trim().split(/\s+/);

    if (changedFiles.length === 0)
        console.warn('No changed files detected or CHANGED_FILES was empty.');

    console.log('Changed files:', changedFiles);

    let modifiedServices;
    try {
        modifiedServices = serviceDirs.filter(service =>
            changedFiles.some(file => file.startsWith(`packages/${service}`))
        );
    } catch (err) {
        console.error(`Error while determining modified services: ${err.message}`);
        modifiedServices = [];
    }

    if (modifiedServices.length === 0)
        console.warn('No modified services detected.');

    console.log('Modified services:', modifiedServices);

    try {
        const output = JSON.stringify(modifiedServices);
        console.log(`::set-output name=modifiedServices::${output}`);
    } catch (err) {
        console.error(`Failed to stringify modified services: ${err.message}`);
        console.log(`::set-output name=modifiedServices::[]`); // Set to an empty array if stringification fails
    }

} catch (error) {
  console.error(`An unexpected error occurred: ${error.message}`);
  console.log('::set-output name=modifiedServices::[]'); // Ensure that the output is set to an empty array on failure
}
