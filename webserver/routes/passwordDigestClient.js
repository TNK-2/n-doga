'use strict';
const bcrypt = require('bcrypt');
const config = require('../config');
const saltRounds = config.BCRYPT_ROUNDS;

function create(password) {
  const saltPromise = bcrypt.genSalt(saltRounds);
  return saltPromise.then(salt => {
    return bcrypt.hashSync(password, salt);
  });
}

function verify(password, passwordDigest) {
  return bcrypt.compare(password, passwordDigest);
}

module.exports = {
  create: create,
  verify: verify
};