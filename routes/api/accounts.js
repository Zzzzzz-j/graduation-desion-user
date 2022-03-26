const express = require("express");
const router = express.Router();
const controller = require('../../controllers/accountController');
const db = require('../../models/db');
const model = require('../../models/accountModel');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploader = multer({
    dest: path.join(path.dirname(__dirname), 'public', 'images')
})


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

// @route  POST api/accounts/loan/application
// @desc   返回json数据 success
// @access Private
router.post("/loan/application", passport.authenticate('jwt', { session: false }), controller.saveLoanApply)

// @route  GET api/accounts/details
// @desc   return userInfo json
// @access Private
router.get('/details', passport.authenticate('jwt', { session: false }), controller.getUserDetails);

// @route  POST api/accounts/user/info
// @desc   返回json数据 success
// @access Private
router.post("/user/info", passport.authenticate('jwt', { session: false }), uploader.array('file', 2), async (req, res) => {
    const front = req.files[0];
    const reverse = req.files[1];
    //获取后缀名
    const frontExtname = path.extname(front.originalname);
    const reverseExtname = path.extname(reverse.originalname);
    //获取上传成功之后的文件路径
    const frontFilepath = `routes/public/images/${front.filename}`;
    const reverseFilepath = `routes/public/images/${reverse.filename}`;
    //上传之后文件的名称
    const frontFilename = frontFilepath + frontExtname;
    const reverseFilename = reverseFilepath + reverseExtname;
    console.log(req.files, 'file');
    console.log(frontFilename, reverseFilename, 'filename');

    //重命名，借用fs的rename重命名的方法，第一参数是源文件地址路径，第二个参数是将源文件改名后的地址(和参数一地址相同，只不过名字变了而已，两个参数都是地址)
    fs.rename(frontFilepath, frontFilename, err => {
        if (!err) {
            console.log('success');
        }
    })
    fs.rename(reverseFilepath, reverseFilename, err => {
        if (!err) {
            console.log('success');
        }
    })

    console.log(req.body,'req.body');


    const { id, name, age, gender, phone, id_number, address, bank_card } = req.body;
    const idCardFront = `http://localhost:5001/api/accounts/img?img=${front.filename}${frontExtname}`
    const idCardReverse = `http://localhost:5001/api/accounts/img?img=${reverse.filename}${reverseExtname}`

    if (req.body.status == 1) {
        const { frontPath, reversePath } = req.body;
        fs.unlink(`routes/public/images/${frontPath.split('=')[1]}`, function (error) {
            if (error) {
                console.log(error);
                return false;
            }
            console.log('删除文件成功');
        })
        fs.unlink(`routes/public/images/${reversePath.split('=')[1]}`, function (error) {
            if (error) {
                console.log(error);
                return false;
            }
            console.log('删除文件成功');
        })
        const results = await model.updateUserInfo(id, name, age, gender, phone, id_number, idCardFront, idCardReverse, address, bank_card);
        if (results.affectedRows) {
            res.status(200).json({ status: 200, message: '提交成功!' });
        } else {
            res.status(200).json({ status: 1001, message: '提交失败!' });
        }
    } else {
        const results = await model.saveUserInfo(id, name, age, gender, phone, id_number, idCardFront, idCardReverse, address, bank_card);
        if (results.insertId) { // 通过判断insertId是不是有正常值，如果有，说明插入成功
            const aws = await model.updateInfoStatus(1, id);
            if (aws.affectedRows) {
                res.status(200).json({ status: 200, message: '提交成功!' });
            } else {
                res.status(200).json({ status: 1001, message: '提交失败!' });
            }
        } else {
            res.status(200).json({ status: 1002, message: '提交失败!' });
        }
    }
})

// @route  GET api/accounts/img
// @desc   return img url
// @access public
router.get('/img', (req, res) => {
    const img = req.query.img
    const path = `routes/public/images/${img}`
    fs.readFile(path, function (err, data) {
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        if (err) {
            res.end('读取错误')
        } else {
            res.end(data)
        }
    })
}
);

module.exports = router;