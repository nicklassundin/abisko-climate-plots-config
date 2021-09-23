const fs = require('fs');
const merge = require('merge');
const normPath = require('path').join(__dirname, 'config');

exports.preset = new Promise((resolve, reject) => {
  fs.readdir(normPath, (err, files) => {
    Promise.all(files.filter((name) => name.includes('.json'))
      .map((file) => {
        try {
          const f = {};
          f[file.replace('.json', '')] = require(`./config/${file}`);
          return f;
        } catch (ERROR) {
          console.log(ERROR);
          throw ERROR;
        }
      })).then((res) => {
      resolve(res.reduce((x, y) => merge(x, y)));
    });
  });
});
