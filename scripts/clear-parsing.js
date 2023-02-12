const glob = require('glob');
const fs = require('fs');

glob.sync('./src/**/*.parsing.ts').forEach(fs.unlinkSync);
