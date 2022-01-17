const fs = require('fs');
const merge = require('merge');
const normPath = require('path').join(__dirname, 'charts');
const { JSDOM } = require('jsdom');

const { window } = new JSDOM('');
const $ = require('jquery')(window);

const language = {
  sv: require('../lang/sv/menu.json'),
  en: require('../lang/en/menu.json'),
};
const par = require('./parse.config.json');

exports.preset = new Promise((resolve, reject) => {
  const struct = {};
  fs.readdir(normPath, (err, FILES) => {
    Promise.all(FILES.filter((name) => name.includes('.json') && !name.includes('[BETA]'))
      .map((file) => {
        try {
          var f = {};
          const full = require(`./charts/${file}`);
          const station = full.config.meta;
		// console.log(station)
		  // fsdfsd
            const temp = {};
            $.extend(true, temp, full);
            // temp.type = temp.type.replace('[stationType]', station);
            // if (!f[station]) f[station] = {};
            const define = temp.config.meta;
            const files = {};
            files.ref = temp;
            struct[define.config] = require(`../${define.config}.json`);
            files.config = {};
            $.extend(true, files.config, struct[define.config]);

            files.config.parse = {};
            $.extend(true, files.config.parse, par[temp.type]);

            if (define.subset) {
              files.subset = require(`../${define.subset}.json`).subset;
            }
            files.set = require(`../${define.set}.json`);
	// console.log(define)
            ['en', 'sv'].forEach((lang) => {
		    try{

              files[lang] = require(`../lang/${lang}/${define.lang}.json`);
              // const dref = files.ref.config.meta[station].data;

              files[lang].dataSource = {
                meta: require(`../lang/${lang}/dataSource.json`),
                // meta: require(`../lang/${lang}/dataSource.json`)[dref],
              };

              files[lang].units = require(`../lang/${lang}/units`);
              files[lang].time = require(`../lang/${lang}/time.json`);
              files[lang].menu = language[lang];
		    }catch(ERROR){
			    console.log("define", define)
			    throw ERROR
		    }
            });
            f[file.replace('.json', '')] = files;
          // });
          return f;
        } catch (ERROR) {
          console.log(ERROR);
          console.log(file);
          // throw ERROR
          return f;
        }
      })).then((res) => {
      // resolve(res.reduce((x,y) => {
      // 	return merge(x,y);
      // }))
      resolve(res);
    });
  });
});
