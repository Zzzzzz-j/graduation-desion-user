const express = require("express");
const router = express.Router();
const controller = require('../../controllers/accountController');
const passport = require('passport');


// @route  GET api/accounts/test
// @desc   返回的请求的json数据
// @access public
router.post("/register", controller.regist)

// @route  POST api/accounts/login
// @desc   返回token jwt passport
// @access public
router.post("/login", controller.login)

// @route  GET api/accounts/current
// @desc   return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
}
);

// @route  POST api/accounts/changepwd
// @desc   返回json数据
// @access Private
router.post("/changepwd", passport.authenticate('jwt', { session: false }), controller.changepwd)

// @route  GET api/accounts/account/list
// @desc   return 账号列表
// @access Private
router.get('/account/list', passport.authenticate('jwt', { session: false }), controller.getAccountList);

// @route  GET api/accounts/delete/account
// @desc   return success
// @access Private
router.post('/delete/account', passport.authenticate('jwt', { session: false }), controller.deleteAccount);

module.exports = router;