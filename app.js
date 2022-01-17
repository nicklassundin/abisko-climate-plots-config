// Pre-setup
const hbs = require('hbs');
const custom = require('./preset').preset;
exports.custom = custom;
exports.genStaticFiles = function (DIR) {
	const fs = require('fs');
	const fileWrite = function (json, file) {
		fs.exists(file, (exists) => {
			if (exists) {
				console.log(file)
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
				const plotTypes = {};
				json.forEach((entry) => {
					Object.keys(entry).forEach((plot) => {
						let dirST = `${DIR}/static/charts/stationType`;
						const dir = `${DIR}/static/charts/stationType/${plot}`;
						if (!fs.existsSync(dirST)) fs.mkdirSync(dirST);
						if (entry[plot].ref.type === 'zonal') {
							entry[plot].ref.tag.data = ['stationName'];
							entry[plot].ref.tag.render = ['stationName'];
						}
						fileWrite(entry[plot], `${DIR}/static/charts/stationType/${plot}.json`);

					});
				});
				// fileWrite(stations, `${DIR}/static/charts/stations.json`);
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
