'use strict';
var Promise = require('bluebird');

/**
 * @constructor
 * Instantiate a user repository class.
 * @param {Object} mysqlConnection - the result of mysql.createConnection()
 */
function UserRepository(mysqlConnection) {
  this.connection = mysqlConnection;
}

/**
 * Fetch a user from the repository.
 * @param {String} username
 * @return {Promise.<UserRecord>}
 */
UserRepository.prototype.getUserByName = function(username) {
  var self = this;
  var query = 'select * from users where name = ?';
  var params = [ username ];

  var promise = new Promise(function(resolve, reject) {
    self.connection
    .query(query, params, function(error, results, fields) {
       if (error) reject(new Error(error));
       resolve(results[0]);
    });
  });
  return promise;
}

module.exports = UserRepository;