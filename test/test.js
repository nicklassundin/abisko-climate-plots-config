const app = require('../app.js');
const fs = require('fs');

describe('test build', () => {
	before(function(done) {
		var dir = './test/static'
		// if(fs.existsSync(dir)) fs.rmdir(dir, { recursive: true }, (err) => {
		// if (err) {
		// throw err;
		// }

		// //console.log(`${dir} is deleted!`);
		// });
		if(!fs.existsSync('./test/static')){
			fs.mkdir('./test/static', (err) => {
				if (err) {
					throw err;
				}
				if(!fs.existsSync('./test/static/charts')){

					fs.mkdir('./test/static/charts', (err) => {
						if (err) {
							throw err;
						}else{
							done()
						}
						//console.log("Directory is created.");
					});
				}else{
					done()
				}
				//console.log("Directory is created.");
			});
		}else{
			done()
		}
	})
	describe('testing', function() {

		it('load and write', (done) => {
			// directory path
			// create new directory
			app.genStaticFiles(__dirname).then((res) => {
				// expect(0).to.eql(10)
				//console.log(res);
				done();
			}).catch((error) => {
				done(error);
			});
		});
	})
	// after(function() {
	// 	var dir = './test/static'
	// 	fs.rmdir(dir, { recursive: true }, (err) => {
	// 		if (err) {
	// 			throw err;
	// 		}

	// 		//console.log(`${dir} is deleted!`);
	// 	});
	// });
});
