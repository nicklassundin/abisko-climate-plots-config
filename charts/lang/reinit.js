const fs = require('fs');
const path = require('path');
const { readdirSync } = require('fs')
const $ = require('jquery');

const getDirectories = source =>
	readdirSync(source, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)

const dirname = __dirname
const dir = getDirectories(dirname)

console.log("Language Dirs")
console.log(dir)

var dirs = {};
dir.forEach(lang => {
	dirs[lang] = readdirSync(`${dirname}/${lang}`, { withFileTypes: true })
		.filter(dirent => !dirent.isDirectory())
		.map(dirent => dirent.name)
		.filter(file => (path.extname(file) == ".json"))
	// console.log(`Language Directory contents ${lang}`)
	// console.log(dirs[lang])
})

var rec = (json) => {
	Object.keys(json).forEach(key => {
		if(typeof json[key] === 'object'){
			json[key] = rec(json[key])
		}else{
			json[key] = "";
			// console.log(typeof json[key])
		}
	})
	return json
}

var reCompare = (file1, file2) => {
	Object.keys(file2).filter(key => file1[key] == undefined).forEach(key => {
		if(typeof file2[key] == `object`){
			file1[key] = {};
		}else{
			file1[key] = file2[key];
		}
	})
	Object.keys(file1).forEach(key => {
		if(typeof file1[key] == `object`){
			if(file2[key] != undefined){

				file1[key] = reCompare(file1[key], file2[key] != undefined ? file2[key] : {})
			}else{
				delete file1[key];
			}
		}else if(file2[key] == undefined){
			delete file1[key]
		}
	})
	return file1
}

dirs[`default`].forEach(fileName => {
	var path = `./default/${fileName}`;
	var file = require(path)
	var emptyFile = rec(file);
	var newfile = JSON.stringify(emptyFile, null, 2);
	fs.writeFileSync(`./charts/lang/default/${fileName}`, newfile);

	dir.filter(each => each != `default`).forEach((lang) => {
		let tmp = (fs.existsSync(`${__dirname}/${lang}/${fileName}`) ? require(`./${lang}/${fileName}`) : {})
		tmp = reCompare(tmp, file);
		var newTmp = JSON.stringify(tmp, null, 2);
		fs.writeFileSync(`./charts/lang/${lang}/${fileName}`, newTmp);
	})
})
