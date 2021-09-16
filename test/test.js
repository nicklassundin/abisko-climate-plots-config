var app = require('./../app.js')
describe('test build', function (done) {
	it('load and write', function (done) {
		app.genStaticFiles(__dirname).then((res) => {
			// expect(0).to.eql(10)
			console.log(res)
			done()
		}).catch((error) =>{

			done(error)
		})
	})
})
