var _ = require('lodash');
var fs = require('fs');

var sync = require('./lib/sync/sync');
var dnodeClient = require("./lib/sync/sync-client");
var Pipeline = require("./lib/sync/pipeline").Pipeline;


var writePipeline = new Pipeline();
writePipeline.addAction({
    exec:function(data){
        _.each(data.syncToSrc, function(toSrc){
            var fromPath = data.trgPath + "/" + toSrc;
            var toPath = data.srcPath + "/" + toSrc;

            var srcHandler = sync.getHandler(fromPath);
            var trgHandler = sync.getHandler(toPath);

            srcHandler.readFile(fromPath,function(base64Data){
               trgHandler.writeFile(toPath,base64Data,function(){
                   console.log("Copied "+fromPath+" to "+toPath);
               })
            });

        });
        return data;
    }
});
writePipeline.addAction({
    exec:function(data){
        _.each(data.syncToTrg, function(toTrg){
            var fromPath = data.srcPath + "/" + toTrg;
            var toPath = data.trgPath + "/" + toTrg;

            var srcHandler = sync.getHandler(fromPath);
            var trgHandler = sync.getHandler(toPath);

            srcHandler.readFile(fromPath,function(base64Data){
                trgHandler.writeFile(toPath,base64Data,function(){
                    console.log("Copied "+fromPath+" to "+toPath);
                })
            });
        });
        return data;
    }
});

function checkForChanges(){
    var path1 = "dnode://folder1";
    var path2 = "file://test-data/folder2";

    sync.compare(path1,path2,sync.filesMatchNameAndSize, function(rslt) {

        rslt.srcPath = path1;
        rslt.trgPath = path2;

        writePipeline.exec(rslt);
    });
}

function scheduleChangeCheck(when,repeat){
    setTimeout(function(){
        console.log("Checking for changes...");
        checkForChanges();

        if(repeat){scheduleChangeCheck(when,repeat)}
    },when);
}

dnodeClient.connect({}, function(handler){
    sync.fsHandlers.dnode = handler;
    scheduleChangeCheck(1000,true);
});


