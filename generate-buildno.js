const fs = require('fs');

console.log('Incrementing build number...');
fs.readFile('src/metadata.json', function (err, content) {
  if (err) throw err;
  const metadata = JSON.parse(content);
  // metadata.buildRevision = metadata.buildRevision + 1;
  metadata.buildRevision = new Date().toISOString()
    .replace(/-/ig, '')
    .replace(/T/, '-')
    .replace(/:/g, '')
    .substring(0, 13);
  fs.writeFile('src/metadata.json', JSON.stringify(metadata), function (err) {
    if (err) throw err;
    console.log(`Current build number: ${metadata.buildMajor}.${metadata.buildMinor}.${metadata.buildRevision} ${metadata.buildTag}`);
  })
});