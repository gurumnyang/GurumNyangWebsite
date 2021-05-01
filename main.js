const express = require('express'), http = require('http');
const path = require('path');

const app = express();

app.set('port', 3000);

http.createServer(app).listen(app.get('port'), function (){
    console.log('Express 서버를 시작한거에요! // port:'+app.get('port'))
});

app.use('/',)