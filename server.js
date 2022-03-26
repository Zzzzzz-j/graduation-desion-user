const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

// 配置图片大小限制信息
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));

// 跨域.  CORS ---------- Start
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3001'], // 所要允许跨域的ip
  methods: ['GET', 'POST'],
  alloweHeaders: ['Conten-Type', 'Authorization']
}));
// 跨域.  CORS ---------- End

// 引入routes
const accounts = require("./routes/api/accounts");

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport 初始化
app.use(passport.initialize());
require('./config/passport')(passport);

app.use("/api/accounts", accounts);

const port = process.env.PORT || 5001;

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})