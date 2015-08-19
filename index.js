var _ = require('lodash');
var fs = require('fs');

var sync = require('./lib/sync/sync');
var Pipeline = require("./lib/sync/pipeline").Pipeline;


var writePipeline = new Pipeline();
writePipeline.addAction({
    exec:function(data){
        _.each(data.syncToSrc, function(toSrc){
            var fromPath = data.trgPath + "/" + toSrc;
            var toPath = data.srcPath + "/" + toSrc;
            fs.createReadStream(fromPath).pipe(fs.createWriteStream(toPath));
        });
        return data;
    }
});
writePipeline.addAction({
    exec:function(data){
        _.each(data.syncToTrg, function(toTrg){
            var fromPath = data.srcPath + "/" + toTrg;
            var toPath = data.trgPath + "/" + toTrg;
            fs.createReadStream(fromPath).pipe(fs.createWriteStream(toPath));
        });
        return data;
    }
});

function checkForChanges(){
    var path1 = "./test-data/folder1";
    var path2 = "./test-data/folder2";

    var rslt = sync.compare(path1,path2,sync.filesMatchNameAndSize);

    rslt.srcPath = path1;
    rslt.trgPath = path2;

    var result = writePipeline.exec(rslt);
}

checkForChanges();