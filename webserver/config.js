'use strict';

const config = {
  WEBSERVER_URL_ROOT: 'http://localhost:3000/',
  MYSQL_HOST: 'localhost',
  MYSQL_DB: 'nn_douga',
  MYSQL_USER: 'root',
  MYSQL_PASSWORD: 'mysql',
  MYSQL_CONNECTIONPOOL: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  SECRET: 'steS6av@*uya',
  BCRYPT_ROUNDS: 15,
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,
  MAILGUN_API_KEY: '2754998d643160dce0ba9e782263940d-6f4beb0a-17eb6ccc',
  MAILGUN_DOMAIN: 'sandboxc5a89f3ae8c64fcc9664dc8cc3574ca0.mailgun.org'
};

module.exports = config;