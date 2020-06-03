const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();


router.get('/profile', isLoggedIn, (req, res) => {
	res.render('profile', { title: '내 정보 - yu1muwitter', user:req.user });
});

router.get('/join', isNotLoggedIn, (req, res) => {
	res.render('join', {
		title: '회원가입 - yu1muwitter',
		user: req.user,
		joinError: req.flash('회원가입에 실패했습니다.'),
	});
});

router.get('/', (req, res, next) => {
  Post.findAll({
    include: {
      model: User,
      attributes: ['id', 'nick'],
    },
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      res.render('main', {
        title: 'yu1muwitter',
        twits: posts,
        user: req.user,
        loginError: req.flash('로그인에 실패하였습니다.'),
      });
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

module.exports = router;