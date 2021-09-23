const app = require('../app.js');

describe('test build', (done) => {
	it('load and write', (done) => {
		const fs = require('fs');

		// directory path
		// create new directory
		fs.mkdir('./test/static', (err) => {
			if (err) {
				throw err;
			}
			console.log("Directory is created.");
		});
		fs.mkdir('./test/static/charts', (err) => {
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
});
