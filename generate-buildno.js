const fs = require('fs');
const METADATA_JSON = "src/metadata.json";
let metadata = {"buildMajor":1,"buildMinor":0,"buildRevision":"20230201.2216","buildTag":"BETA"}
console.log('Incrementing build number...');
if (fs.existsSync(METADATA_JSON)) {
  metadata = JSON.parse(fs.readFileSync('src/metadata.json'));
}
// metadata.buildRevision = metadata.buildRevision + 1;
metadata.buildRevision = new Date().toISOString()
  .replace(/-/ig, '')
  .replace(/T/, '.')
  .replace(/:/g, '')
  .substring(0, 13);
fs.writeFile(METADATA_JSON, JSON.stringify(metadata), function (err) {
  if (err) throw err;
  console.log(`Current build number: ${metadata.buildRevision} ${metadata.buildTag}`);
})