const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpg",
    "png" : "image/png",
    "js" : "text/javascript",
    "css" : "text/css"
};

http.createServer(function (req, res) {
   var uri = url.parse(req.url).pathname; //get pathname
   var filename = path.join(process.cwd(), unescape(uri)); //add filename
   console.log('Loading '+uri);
   var stats;

   try {
       stats = fs.lstatSync(filename); //get filename
   } catch (e){
       res.writeHead(404, {'Content-Type':'text/plain'});
       res.write('404 Not Found\n');
       res.end();
       return;
   }

    if (stats.isFile()){ //cek if access file
        //get extension and check into array mimeTypes
       var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
       res.writeHead(200, {'Content-Type': mimeType});

       var fileStream = fs.createReadStream(filename);
       fileStream.pipe(res);
    }else if(stats.isDirectory()){ //cek if access directory
        res.writeHead(302, {'Location':'index.html'});
        res.end();
    } else {
        res.writeHead(500, {'Content-Type':'text/html'});
        res.write("500 Internal error\n");
        res.end();
    }
}).listen(8888);

console.log("Server running...");