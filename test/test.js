const app = require('../app.js');
const fs = require('fs');

describe('test build', (done) => {
	it('load and write', (done) => {

		// directory path
		// create new directory
		if(!fs.existsSync('./test/static')) fs.mkdir('./test/static', (err) => {
			if (err) {
				throw err;
			}
			console.log("Directory is created.");
		});
		if(!fs.existsSync('./test/static/charts')) fs.mkdir('./test/static/charts', (err) => {
			if (err) {
				throw err;
			}
			console.log("Directory is created.");
		});
		app.genStaticFiles(__dirname).then((res) => {
			// expect(0).to.eql(10)
			console.log(res);
			done();
		}).catch((error) => {
			done(error);
		});
	});
	after(function() {
		var dir = './test/static'
		fs.rmdir(dir, { recursive: true }, (err) => {
			if (err) {
				throw err;
			}

			console.log(`${dir} is deleted!`);
		});
	});
});
