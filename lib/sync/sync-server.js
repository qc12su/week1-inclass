var fs = require("fs");
var _ = require("lodash");
var dnode = require('dnode');
var base64util = require('./base64utils')


var base = "./test-data/"
var server = dnode({
    list: function(path,cb){
        path = base + path;
        var rslt = fs.readdirSync(path);
        cb(rslt);
    },
    stat: function(path,cb){
        path = base + path;
        var rslt = fs.statSync(path);
        cb(rslt);
    },
    writeFile: function(path,base64data,cb){
        base64util.writeFromBase64Encoded(base64data, base + path);
        cb();
    },
    readFile: function(path,cb){
        cb(base64util.readBase64Encoded(base + path));
    }
});

server.listen(5004);


