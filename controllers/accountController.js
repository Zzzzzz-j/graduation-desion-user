const model = require('../models/accountModel')
const jwt = require('jsonwebtoken');

module.exports = {
    async login(req, res) {
        const { password, phone } = req.body;
        const phoneResults = await model.getUserByPhone(phone);
        if (phoneResults.length > 0) {
            const pwdResults = await model.getUserByPassword(phone, password);
            if (pwdResults.length > 0) {
                const { user_id, username, phone, password } = pwdResults[0];
                const rule = {
                    id: user_id,
                    name: username,
                    phone: phone,
                    password: password
                };
                jwt.sign(rule, 'secret', { expiresIn: 60 * 60 * 2 }, (err, token) => {
                    if (err) throw err;
                    res.json({
                        status: 200,
                        token: 'Bearer ' + token
                    });
                });
            } else {
                res.json({ status: 1001, message: '密码错误!' })
            }
        } else {
            res.json({ status: 1001, message: '该手机号还未注册!' })
        }
    },
    async regist(req, res) {
        const { username, password, phone } = req.body;
        const result = await model.getUserByPhone(phone);
        if (result.length > 0) {
            res.status(200).json({ status: 1001, message: '该手机号已被注册!' });
        } else {
            const results = await model.saveUser(username, password, phone, 0);
            if (results.insertId) { // 通过判断insertId是不是有正常值，如果有，说明插入成功
                res.status(200).json({ status: 200, message: '注册成功!' });
            } else {
                await res.status(200).json({ status: 1002, message: '注册失败!' });
            }
        }
    },
    async changepwd(req, res) {
        const { password, id } = req.body;
        const results = await model.updatePassword(password, id);
        if (results.affectedRows) {
            res.status(200).json({ status: 200, message: '修改成功!' });
        } else {
            await res.status(200).json({ status: 1001, message: '修改失败!' });
        }
    },
    async saveLoanApply(req, res) {
        const { id, name, money, startTime, endTime, time, rate } = req.body;
        const results = await model.saveLoanApply(id, name, money, startTime, endTime, time, rate, 0);
        if (results.insertId) { // 通过判断insertId是不是有正常值，如果有，说明插入成功
            res.status(200).json({ status: 200, message: '提交成功!' });
        } else {
            await res.status(200).json({ status: 1002, message: '提交失败!' });
        }
    },
    async saveUserInfo(req, res) {
        const { id, name, age, gender, phone, id_number, idCardFront, idCardReverse, address, bank_card } = req.body;
        const results = await model.saveUserInfo(id, name, age, gender, phone, id_number, idCardFront, idCardReverse, address, bank_card);
        if (results.insertId) { // 通过判断insertId是不是有正常值，如果有，说明插入成功
            const aws = await model.updateInfoStatus(1,id);
            if(aws.affectedRows) {
                res.status(200).json({ status: 200, message: '提交成功!' });
            } else {
                res.status(200).json({ status: 1001, message: '提交失败!' });
            }
        } else {
            await res.status(200).json({ status: 1002, message: '提交失败!' });
        }
    },
    async getUserDetails(req, res) {
        const { id } = req.query;
        const results = await model.getUserInfoById(id);
        if (results.length > 0) {
            res.json({ status: 200, data: results[0] })
        } else {
            await res.status(404);
        }
    },
    async getApplicationList(req, res) {
        const { pageNum, pageSize, id } = req.query;
        console.log(id,'id');
        const results = await model.getApplication(id);
        const length = results.length;
        if (length > 0) {
            results.reverse();
            if(parseInt(pageNum) * parseInt(pageSize) > length) {
                res.json({
                    pageNum: pageNum,
                    pageSize: pageSize,
                    total: length,
                    status: 200,
                    data: [...results.slice((pageNum - 1) * 10)]
                })
            } else {
                res.json({
                    pageNum: pageNum,
                    pageSize: pageSize,
                    total: length,
                    status: 200,
                    data: [...results.slice((pageNum - 1) * 10 , pageNum * 10)]
                })
            }
        } else {
            await res.json({ status: 200, total: 0, data: [] });
        }
    },
    async deleteApply(req, res) {
        const { id } = req.body;
        const results = await model.deleteApplyById(id);
        if (results.affectedRows) {
            res.status(200).json({ status: 200, message: '取消成功!' });
        } else {
            await res.status(200).json({ status: 1001, message: '取消失败!' });
        }
    },
}