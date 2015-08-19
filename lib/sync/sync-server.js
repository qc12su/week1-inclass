var connect = require('connect');
var http = require('http');
var url = require("url");
var fs = require("fs");

var app = connect();

var base = "./test-data/folder2"

function list(path){
    return fs.readdirSync(path);
}

function stat(path){
    return fs.statSync(path);
}

var actions = {
    list:list,
    stat:stat
}

app.use(function(req, res){

    var path = url.parse(req.url).pathname;

    var parts = path.split("/");
    var action = parts[parts.length - 1];
    var rslt = {error:"Unknown action"};

    if(action in actions){
        var pathWithoutAction = path.substring(0, path.length - (action.length + 1));
        var resolvedPath = base + pathWithoutAction.replace(/\.\./gi,"");
        rslt = actions[action](resolvedPath);
    }

    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(rslt));
})


http.createServer(app).listen(3000)