const fs=require('fs'),path=require('path');
for(const [name,content] of Object.entries(require('./native-source.json'))){const dest=path.resolve(__dirname,name);if(!dest.startsWith(__dirname+path.sep))throw Error('Invalid source path');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,content);}
