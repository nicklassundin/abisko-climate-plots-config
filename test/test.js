const app = require('../app.js');

describe('test build', (done) => {
  it('load and write', (done) => {
    app.genStaticFiles(__dirname).then((res) => {
      // expect(0).to.eql(10)
      console.log(res);
      done();
    }).catch((error) => {
      done(error);
    });
  });
});
