const express = require('express'), http = require('https');
const path = require('path');
const consoleStamp = require('console-stamp');
const bodyParser = require('body-parser')
const router = express.Router()
const cookieParser = require('cookie-parser');


router.get('/', function (req, res) {
    res.redirect('public/HTML/main.html');
    console.log(`[/][${req.ip}][request]`);
});

router.get('/imfor', function (req,res) {
    res.writeHead('200', {'Content-type':'text/html;charset=utf8'});
    res.end(`<p>'ip': '${req.ip}'</p><p>'ips': '${req.ips}'</p><p>'user': '${req.user}'</p><p>'hostname': '${req.hostname}'</p><p>'url': '${req.url}'</p><p>'params': '${req.params}'</p>`);
    console.log(`[/imfor][${req.ip}][request]`);
});

router.get('/login', function (req, res) {
    res.redirect('public/HTML/login.html');
    console.log(`[/login][${req.ip}][request]`);
});

router.get('/imfor/:name', function (req, res) {
    if(req.params.name == "error"){
        res.send('<H1>이런! 특수문자만 적은 모양이군요!</H1>' +
            '<a href="https://gurumnyang.kro.kr/">돌아가기</a>');
        res.end();
    }
    res.send('<H1>' + req.params.name + ', Hello !</H1>' +
        '<a href="https://gurumnyang.kro.kr/">돌아가기</a>');
    res.end();
})

router.get('/setCookie', function (req, res) {
    res.cookie('json', {
        id: 'gurumnyang',
        name: 'cookie'
    });
    res.end();
})

exports.router = router;