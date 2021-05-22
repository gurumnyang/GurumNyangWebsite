const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const router = express.Router()
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const fs = require('fs');
const rateLimit = require("express-rate-limit");
const moment = require('moment');
const multer = require('multer');
const cors = require('cors');


router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.use(cors());

const fileLoad = function(file){
    console.log(path.join(__dirname,`public/HTML/${file}`));
    return path.join(__dirname,`public/HTML/${file}`);
}


//이미지 업로드 설정
var storage = multer.diskStorage({
    destination: function (req, res, callback) {
        callback(null, 'upload/image')
    },
    filename: function (req, res, callback) {
        callback(null, file.originalname + Date.now());
    }

});
var upload = multer({
    storage:storage,
    limits: {
        files:10,
        fileSize: 1024 * 1024 * 1024
    }
});




// Apply to all requests
const limiter = new rateLimit({
    windowMs: 60*1000,
    max: 30
})
router.use(limiter);



//접속 싹다 로그로 남기고 http->https로 리다이렉트-----------
router.all('*',function (req,res, next){
    let protocol = req.headers['x-forwarded-proto'] || req.protocol;
    if (protocol === 'https'){
        if(req.url !== '/favicon.ico'){
            console.log(`[${req.url}][${req.ip}][${req.method}]`);
            fs.appendFile(path.join(__dirname,'/logs/log.txt'), `[${moment().format('YYYY/MM/DD HH:mm:ss')}] [${req.url}][${req.ip}][${req.method}]`+'\n','utf8', function(){})
        }
        next();
    } else {
        let from = `${protocol}://${req.hostname}${req.url}`;
        let to = `https://${req.hostname}${req.url}`;
        console.log(`[${req.url}][${req.ip}][${from} --> ${to}]`);
        fs.appendFile(path.join(__dirname,'/logs/log.txt'), `[${moment().format('YYYY/MM/DD HH:mm:ss')}][${req.url}][${req.ip}][${from} --> ${to}]`+'\n','utf8', function(){})
        res.redirect(to);
    }
});



//자동 웹문서 로드 --------------------------
const arrayUrl = [
    '',
    'login',
    'search',
    'cat'
];
const arrayHTML = [
    'main.html',
    'login.html',
    'search.html',
    'cat.html'
]

router.get('*', function(req,res,next){
    if(arrayUrl.includes(req.url.replace('/', ''))) {
        console.log('array통해서 로드됨')
        if(arrayHTML[arrayUrl.indexOf(req.url)]=="undefined"){
            res.sendStatus(404);
            res.send('<h1>404 not found</h1>');
        } else {
            res.sendFile(fileLoad(arrayHTML[arrayUrl.indexOf(req.url.replace('/', ''))]));
        }


    } else {
        next();
    }
})

//-------------------------------------

router.get('/imfor', function (req,res) {
    res.writeHead('200', {'Content-type':'text/html;charset=utf8'});
    res.end(`<p>'ip': '${req.ip}'</p><p>'ips': '${req.ips}'</p><p>'user': '${req.user}'</p><p>'hostname': '${req.hostname}'</p><p>'url': '${req.url}'</p><p>'params': '${req.params}'</p><p>'protocol': '${req.headers['x-forwarded-proto'] || req.protocol}'</p>`);
});


router.get('/imfor/:name', function (req, res) {
    if(req.params.name === "error"){
        res.send('<h1>이런! 특수문자나 한글은 지원하지 않아요!</h1>' +
            '<a href="https://gurumnyang.kro.kr/">돌아가기</a>');
    }
    res.send('<h1>' + req.params.name + ', Hello !</h1>' +
        '<a href="https://gurumnyang.kro.kr/">돌아가기</a>');
});

router.get('/setCookie', function (req, res) {
    res.cookie('setCookie-test', {
        id: 'gurumnyang',
        name: 'cookie'
    });
    res.send('쿠키 설정이 완료되었습니다.')
});
router.get('/getCookie', function (req, res){
    res.send(req.cookies);
    console.log(req.cookies);
});
router.get('/login-make', function(req, res){
    res.cookie('login', {
        id: 'user',
        name: 'login'
    });
    console.log(`[${req.url}][${req.ip}][${req.method}][쿠키 지급됨]`);
    res.send('<p>로그인 정보가 성공적으로 저장되었습니다! (아이디와 비번이 아니라 로그인 사실이 저장됩니다)</p><a href="https://gurumnyang.kro.kr/">돌아가기</a>');
} );


exports.router = router;