const db = require('./db');

module.exports = {
    getUserByNameAndPwd(username, password) {
        return db.query(`SELECT * FROM e_user where username='${username}' and password='${password}'`);
    },
    saveUser(username, password, phone, info_status) {
        return db.query(`insert into e_user set ?`, { username, password, phone, info_status });
    },
    getUserByPhone(phone) {
        return db.query(`SELECT * FROM e_user where phone='${phone}'`);
    },
    getUserByPassword(phone,password) {
        return db.query(`SELECT * FROM e_user where phone='${phone}' and password='${password}'`);
    },
    updatePassword(password,id) {
        return db.query(`UPDATE e_user SET password=${password} WHERE user_id=${id}`)
    },
    getAccountList() {
        return db.query(`SELECT * FROM e_user`);
    },
    deleteByUserId(id) {
        return db.query(`DELETE FROM e_user WHERE user_id=${id}`);
    }
};