const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passwordDigestClient = require('./passwordDigestClient');
const mailSender = require('./mailSender');
const config = require('../config');
const jwt = require('jsonwebtoken');

router.get('/', (req, res, next) => {
  res.render('signup/index.pug', {
    user: req.user
  });
});

router.post('/', (req, res, next) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const repassword = req.body.repassword.trim();

  if (!email) {
    res.render('signup/index.pug', {
      errorMessage: 'メールアドレスを入力して下さい。',
      user: req.user
    });
  } else if (password != repassword) {
    res.render('signup/index.pug', {
      errorMessage: '再入力のパスワードが同じではありません。',
      user: req.user
    });
  } else {
    const passwordDigestPromise = passwordDigestClient.create(password);
    passwordDigestPromise.then((passwordDigest) => {
      return User.findOne({
        where: {
          email: email
        }
      }).then(user => {
        if (user) {
          res.render('signup/index.pug', {
            errorMessage: 'すでに登録されているメールアドレスです。'
          });
        } else {
          return User.create({
            email: email,
            passwordDigest: passwordDigest,
            isEmailVerified: false,
            isAdmin: false
          }).then(user => {
            mailSender(email);
            // 自動でログイン
            req.login(user, function(err) {
              if (err) {
                return next(err);
              }
              return res.render('signup/mailsendmessage.pug', {
                email: email,
                user: req.user
              });
            });
          });
        }
      });
    });
  }
});

router.get('/emailverify', (req, res, next) => {
  const token = req.query.token;
  if (token) {
    let decoded = null;
    try {
      decoded = jwt.verify(token, config.SECRET);
    } catch (err) {
      res.render('signup/emailverify.pug', { user: req.user });
      return;
    }

    const email = decoded.email;
    User.update(
      {
        isEmailVerified: true
      },
      {
        where: {
          email: email
        }
      }
    )
      .then(user => {
        res.render('signup/emailverify.pug', { email: email, user: req.user });
      })
      .catch(e => {
        console.error(e);
        res.render('signup/emailverify.pug', { user: req.user });
      });
  } else {
    res.render('signup/emailverify.pug', { user: req.user });
  }
});

module.exports = router;