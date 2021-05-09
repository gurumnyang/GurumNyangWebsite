//모듈 호출
const express = require('express'), http = require('http');
const path = require('path');
const static = require('serve-static');
const consoleStamp = require('console-stamp');
const https = require('https');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const rateLimit = require("express-rate-limit");
const favicon = require('serve-favicon');

const options = {
    key: fs.readFileSync(path.join(__dirname, 'private.key').toString()),
    cert: fs.readFileSync(path.join(__dirname,'certificate.crt').toString()),
    ca: fs.readFileSync(path.join(__dirname, 'ca_bundle.crt'))
};


app.set('port', 443);
app.use('/public',static(path.join(__dirname,'public')));
app.use('/',static(path.join(__dirname,'robot.txt')));

app.use('/', require('./router.js').router)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true

}))

//아이콘
app.use(favicon(__dirname + '/public/image/favicon.ico'));

// Apply to all requests
const limiter = new rateLimit({
    windowMs: 60*1000,
    max: 30
})
app.use(limiter);


//타임스탬프
consoleStamp(console, ['yyyy/mm/dd HH:MM:ss.l']);


https.createServer(options, app).listen(process.env.SSL_PORT || 443, function (){
    console.log(`Express https 서버를 시작한거에요! `);
    console.log(`port:[${app.get('port')}]`);
});

//보조 http서버
http.createServer(options, app).listen(process.env.SSL_PORT ||3000, function (){
    console.log(`Express http 보조 서버를 시작한거에요! `);
    console.log(`port:[${app.get('port')}]`);
});
//http 리다이렉트



app.post('/login-test',function(req, res, next) {


    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    console.log(`[/Login][${req.ip}][POST][id:${paramId}][password:${paramPassword}]`);
    res.writeHead('200', {'Content-type':'text/html;charset=utf8'});
    res.write(`<p>당신의 아이디는 ${paramId}</p>`);
    res.write(`<p>당신의 비밀번호는 ${paramPassword}</p>`);
    res.end();
});
app.use('/',function(req, res, next) {
    let paramContent = req.body.loginContent;
    if(paramContent){
        if(paramContent.replace(/[^a-zA-Z ]/g, "") == ""){
            res.redirect('https://gurumnyang.kro.kr/imfor/error');
        } else {
            res.redirect('https://gurumnyang.kro.kr/imfor/'+paramContent.replace(/[^a-zA-Z ]/g, ""));
            console.log(`[/main][${req.ip}][POST]["${req.body.loginContent}"]`);
        }
    }
});




