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
        return db.query(`UPDATE e_user SET password='${password}' WHERE user_id=${id}`)
    },
    saveLoanApply(user_id, name, money, start_time, end_time, time, rate, approve) {
        return db.query(`insert into e_loan_application set ?`, { user_id, name, money, start_time, end_time, time, rate, approve });
    },
    saveUserInfo(user_id, name, age, gender, phone, id_number, id_card_front, id_card_reverse, address, bank_card) {
        return db.query(`insert into e_user_info set ?`, { user_id, name, age, gender, phone, id_number, id_card_front, id_card_reverse, address, bank_card });
    },
    updateInfoStatus(info_status, id) {
        return db.query(`UPDATE e_user SET info_status=${info_status} WHERE user_id=${id}`)
    },
    getUserInfoById(id) {
        return db.query(`SELECT * FROM e_user_info WHERE user_id=${id}`);
    },
    updateUserInfo(id, name, age, gender, phone, id_number, id_card_front, id_card_reverse, address, bank_card) {
        return db.query(`UPDATE e_user_info SET name="${name}", age=${age}, gender="${gender}", phone=${phone}, id_number=${id_number}, 
        id_card_front="${id_card_front}", id_card_reverse="${id_card_reverse}", address="${address}", bank_card=${bank_card} WHERE user_id=${id}`)
    },
    getApplication(id) {
        return db.query(`SELECT * FROM e_loan_application where user_id=${id}`);
    },
    deleteApplyById(id) {
        return db.query(`DELETE FROM e_loan_application WHERE apply_id=${id}`);
    }
};