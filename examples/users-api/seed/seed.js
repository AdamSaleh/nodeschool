/**
 * DB Seeder - seeds MongoDB with documents from `users.json` on disk
 *
 * To seed, run `npm run-script seed`
 */

var logger = require('winston');
var PouchDB = require('pouchdb');

var seed = function (dbname, cb) {
  var userData = require('./users.json');
  var oldDB = new PouchDB(dbname);
  var newDB;
  oldDB.destroy()
  .then(() => {
    newDB = new PouchDB(dbname);
    var data = userData[0].documents.map(u => {
      u._id = u.username;
      return u;
    });
    return newDB.bulkDocs(data);
  }).then(function (result) {
    logger.log(result);
    newDB.close(cb);
  }).catch(function (err) {
    logger.log(err);
    newDB.close(cb);
  });
};

// Run explicitly (e.g. not require'd)
if (require.main === module) {
  if (process.argv.length !== 3) {
    logger.log('You need to specify database.');
  } else {
    seed(process.argv[2], function () {
      logger.log('Seeding complete, exiting.');
    });
  }
}

module.exports = seed;
