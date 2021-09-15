var fs = require('fs');
// Pre-setup
var $ = require("jquery");
var hbs = require('hbs');
const custom = require('./config/preset.js').preset;
exports.custom = custom;

var stati = require('./static/charts/stations.json')
hbs.registerPartials(__dirname + '/views/partials', function (err) {
	custom.then(chrts => {
		fileWrite(chrts, __dirname+'/static/preset.json') 
	})
});

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
const merge = require('./charts/preset/merge.js').preset;
merge.then((json) => {
	fileWrite(json, __dirname+'/static/charts/merged.json')
	var stations = {};
	json.forEach(entry => {
		Object.keys(entry).forEach(station => {
			if(!stations[station]) stations[station]= [];
			Object.keys(entry[station]).forEach(key => {
				// var type = entry[station][key].ref.type
				var type = station
				var dir = __dirname+'/static/charts/stationType/'+type;
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
				
				fileWrite(entry[station][key], __dirname+'/static/charts/stationType/'+type+'/'+key+'.json')

				stations[station].push(key);
			})
		})
	})
	fileWrite(stations, __dirname+'/static/charts/stations.json');
})
