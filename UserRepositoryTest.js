'use strict';

var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    Mysql = require('mysql'),
    sinon = require('sinon'),
    Promise = require('bluebird'),
    UserRepository = require('./UserRepository.js');

chai.use(chaiAsPromised);

describe('UserRepository', function() {
   var mysqlConnection = Mysql.createConnection({host: 'localhost'});
   var mysqlMock = sinon.mock(mysqlConnection);
   var userRepository = new UserRepository(mysqlConnection);

   it('generates the proper select query when fetching a user and return promise', function() {
       var name = 'john doe';
       var results = [{ id: 0, name: name }];
       var fields = ['id', 'name'];
       var expectation = mysqlMock.expects('query')
                .withArgs('select * from users where name = ?', [ name ])
                .callsArgWith(2, null, results, fields);

       return userRepository.getUserByName(name).should.eventually.become(results[0]);
   });

   it('rejects promises when there is a mysql error', function() {
       var expectation = mysqlMock.expects('query')
                .once()
                .callsArgWith(2, 'example error', null, null);
       return userRepository.getUserByName('fred').should.be.rejectedWith('example error');
   });
});