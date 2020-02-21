const { assert } = require('chai');

const { getUserByEmail } = require('../helper.js');

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", users)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it('should return undefined if email does not exist in database', function(){
    const user = getUserByEmail("user111@example.com", users)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  })
});