const mysql = require('mysql');
const { HOST, USER, PASSWORD, DATABASE } = require('../config/db.config')
const pool = mysql.createPool({
    connectionLimit: 10,
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
});

function getDataBank(sql, path) {
    return new Promise((resolve, rejects) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                rejects(err); // not connected!
            } else {
                connection.query(
                    //"SELECT * FROM t_user where username='"+username+"' and password='"+password+"'",
                    sql, path,
                    function (error, results) {
                        connection.release(); // 释放连接, 放回pool中
                        if (error) {
                            console.log('连接数据库失败');
                            rejects(error);
                        } else {
                            console.log(results);
                            resolve(results);
                        }
                    });
            };

        });
    })
}

module.exports = {
    query: getDataBank
}