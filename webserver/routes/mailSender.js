'use strict';
const config = require('../config');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js')({
  apiKey: config.MAILGUN_API_KEY,
  domain: config.MAILGUN_DOMAIN
});

function send(email) {
  const token = jwt.sign({ email: email }, config.SECRET);
  const url = config.WEBSERVER_URL_ROOT + 'signup/emailverify?token=' + token;

  const data = {
    from: 'エヌエヌ動画 <postmaster@sandboxc5a89f3ae8c64fcc9664dc8cc3574ca0.mailgun.org>',
    to: email, // Need add Recipient of Mailgun
    subject: '【エヌエヌ動画】メールアドレスの確認',
    text: url + '\n以上のURLからアクセスして下さい。'
  };

  mailgun.messages().send(data, function(error, body) {
    if (error) {
      console.log(error);
      return;
    }
    console.log('Mail sended.');
    console.log(body);
  });
}

module.exports = send;