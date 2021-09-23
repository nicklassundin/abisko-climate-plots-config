// Pre-setup
const hbs = require('hbs');
const custom = require('./preset').preset;
exports.custom = custom;
exports.genStaticFiles = function (DIR) {
	const fs = require('fs');
	const fileWrite = function (json, file) {
		fs.exists(file, (exists) => {
			if (exists) {
				fs.writeFile(file, JSON.stringify(json, null, 2), (ERROR) => {
					if (ERROR) throw ERROR;
				});
			} else {
				fs.writeFile(file, JSON.stringify(json, null, 2), { flag: 'wx' },
					(ERROR) => {
						if(ERROR) throw ERROR
					});
			}
		});
	};
	return new Promise((res, rej) => {
		try {
			hbs.registerPartials(`${DIR}/views/partials`, (err) => {
				custom.then((chrts) => {
					fileWrite(chrts, `${DIR}/static/preset.json`);
				});
			});
			res(DIR);
		} catch (error) {
			rej(error);
		}
	}).then((DIR) => {
		try {
			const merge = require('./charts/preset/merge.js').preset;
			merge.then((json) => {
				fileWrite(json, `${DIR}/static/charts/merged.json`);
				const stations = {};
				json.forEach((entry) => {
					Object.keys(entry).forEach((station) => {
						if (!stations[station]) stations[station] = [];
						Object.keys(entry[station]).forEach((key) => {
							// var type = entry[station][key].ref.type
							const type = station;
							const dir = `${DIR}/static/charts/stationType/${type}`;
							if (!fs.existsSync(dir)) fs.mkdirSync(dir);
							// console.log('-----')
							// console.log(station)
							// console.log(entry[station][key].config.parse)
							// console.log('-----')
							if (entry[station][key].ref.type === 'zonal') {
								// TODO temporarly special case
								entry[station][key].ref.tag.data = [station];
								entry[station][key].ref.tag.render = [station];
							}

							fileWrite(entry[station][key], `${DIR}/static/charts/stationType/${type}/${key}.json`);

							stations[station].push(key);
						});
					});
				});
				fileWrite(stations, `${DIR}/static/charts/stations.json`);
			});
			return true;
		} catch (error) {
			throw error;
		}
	});
};
exports.time = {
	en: require('./charts/lang/en/time.json'),
	sv: require('./charts/lang/sv/time.json'),
};
