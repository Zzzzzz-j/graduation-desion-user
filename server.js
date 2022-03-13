const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

// 跨域.  CORS ---------- Start
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000'], // 所要允许跨域的ip
  methods: ['GET', 'POST'],
  alloweHeaders: ['Conten-Type', 'Authorization']
}));
// 跨域.  CORS ---------- End

// 引入routes
const accounts = require("./routes/api/accounts");
const users = require("./routes/api/users");

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport 初始化
app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/api/accounts", accounts);
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})