const http = require('http');
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js')



http.createServer(function(req,res){
    fs.readFile("./index.html","UTF-8",function(err,html){
        if(req.url === "/"){
            res.writeHead(200,{"Content-ype":"text/html"});
            res.end(html);
        }else if(req.url.match("\.css$")){
            var cssPath = path.join(__dirname,req.url);
            var fileStream = fs.createReadStream(cssPath,"UTF-8");
            res.writeHead(200,{"Content-Type":"text/css"});
            fileStream.pipe(res);
        }else if(req.url.match("\.js$")){
            var jsPath = path.join(__dirname,req.url);
            var fileStream = fs.createReadStream(jsPath,"UTF-8");
            console.log(jsPath);
            res.writeHead(200,{"Content-Type":"text/javascript"});
            fileStream.pipe(res);
        }else{
            console.log(CryptoJS.HmacSHA256("test", "secret").toString(CryptoJS.enc.Hex));
        }
    });
    console.log(req.url)
}).listen(3000);



