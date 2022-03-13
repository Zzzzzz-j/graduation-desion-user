const db = require('./db');

module.exports = {
    getAccountList() {
        return db.query(`SELECT * FROM e_user`);
    },
    deleteByUserId(id) {
        return db.query(`DELETE FROM e_user WHERE user_id=${id}`);
    },
    deleteInfoByUserId(id) {
        return db.query(`DELETE FROM e_user_info WHERE user_id=${id}`);
    },
    deleteApplyByUserId(id) {
        return db.query(`DELETE FROM e_loan_application WHERE user_id=${id}`);
    },
    getUserInfoById(id) {
        return db.query(`SELECT * FROM e_user_info WHERE user_id=${id}`);
    },
    getApplicationByApprove(approve) {
        return db.query(`SELECT * FROM e_loan_application WHERE approve=${approve}`);
    },
    updateApprove(id, status) {
        return db.query(`UPDATE e_loan_application SET approve=${status} WHERE apply_id=${id}`)
    },
};
