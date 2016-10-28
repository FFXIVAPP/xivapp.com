require('babel-register');

const DataService = require('../src/data-service/');
const dataService = new DataService({
  config: {
    host: '127.0.0.1'
  }
});
dataService.ensureConnection()
  .then((DB) => {
    DB.User.create({}, (err, user) => {
      if (err) {
        throw err;
      }
      console.log(user);
      process.exit();
    });
  })
  .catch((err) => console.log(err));
