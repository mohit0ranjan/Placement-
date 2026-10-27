const fs = require('fs'); const path = require('path');
for (const [name, content] of Object.entries(require('./native-source.json'))) { const dest = path.join(__dirname, name); fs.mkdirSync(path.dirname(dest), {recursive:true}); fs.writeFileSync(dest, content); }
