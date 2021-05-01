//모듈 호출
const express = require('express'), http = require('http');
const path = require('path');
const static = require('serve-static');
const consoleStamp = require('console-stamp');

const app = express();

app.set('port', 3000);
app.use('/public',static(path.join(__dirname,'public')));

//타임스탬프
consoleStamp(console, ['yyyy/mm/dd HH:MM:ss.l']);


http.createServer(app).listen(app.get('port'), function (){
    console.log(`Express 서버를 시작한거에요! `);
    console.log(`port:[${app.get('port')}]`);
});
app.get('/', function (req, res) {
    res.redirect('public/HTML/main.html');
    console.log(`[/][${req.ip}][request]`);
});

app.get('/imfor', function (req,res) {
   res.writeHead('200', {'Content-type':'text/html;charset=utf8'});
   res.end(`<p>'ip': '${req.ip}'</p><p>'ips': '${req.ips}'</p><p>'user': '${req.user}'</p><p>'hostname': '${req.hostname}'</p><p>'url': '${req.url}'</p><p>'params': '${req.params}'</p>`);
    console.log(`[/imfor][${req.ip}][request]`);
});