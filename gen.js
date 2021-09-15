var fs = require('fs');
// Pre-setup
var $ = require("jquery");
var hbs = require('hbs');
const custom = require('./preset.js').preset;
exports.custom = custom;


/////

var fileWrite = function(json, file){
	fs.exists(file, function (exists) {
		if(exists){
			fs.writeFile(file, JSON.stringify(json,null,2), (ERROR) => {
				if(ERROR) throw ERROR
			})
		}else{
			fs.writeFile(file, JSON.stringify(json,null,2), {flag: 'wx'}, function (err,data) {})
		}
	})
}
exports.genStaticFiles = function(DIR){
	return new Promise((res, rej) => {
		try{
			hbs.registerPartials(DIR + '/views/partials', function (err) {
				custom.then(chrts => {
					fileWrite(chrts, DIR+'/static/preset.json') 
				})
			});
			const merge = require('./charts/preset/merge.js').preset;
			merge.then((json) => {
				fileWrite(json, DIR+'/static/charts/merged.json')
				var stations = {};
				json.forEach(entry => {
					Object.keys(entry).forEach(station => {
						if(!stations[station]) stations[station]= [];
						Object.keys(entry[station]).forEach(key => {
							// var type = entry[station][key].ref.type
							var type = station
							var dir = DIR+'/static/charts/stationType/'+type;
							if(!fs.existsSync(dir)) fs.mkdirSync(dir);
							// console.log('-----')
							// console.log(station)
							// console.log(entry[station][key].config.parse)
							// console.log('-----')
							if(entry[station][key].ref.type === 'zonal'){
								// TODO temporarly special case
								entry[station][key].ref.tag.data = [station]
								entry[station][key].ref.tag.render = [station]
							}

							fileWrite(entry[station][key], DIR+'/static/charts/stationType/'+type+'/'+key+'.json')

							stations[station].push(key);
						})
					})
				})
				fileWrite(stations, DIR+'/static/charts/stations.json');
			})
			res(true)
		}catch(error){
			rej(error)
		}
	})
}
