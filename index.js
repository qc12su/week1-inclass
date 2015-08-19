var fs = require('fs')


function compareDirectories(directoryInfo1, directoryInfo2){
    var state1 = {};
    var state2 = {};

    var fileList1 = directoryInfo1.fileList;
    var fileList2 = directoryInfo2.fileList;

    var path1 = directoryInfo1.path;
    var path2 = directoryInfo2.path;

    if(!fileList1 || !fileList2) {
        throw "An invalid directory info object was passed to the compare " +
                "directories method that had a null or " +
                "undefined file list.";
    }

    if(!path1 || !path2){
        throw "An invalid directory info object was passed to the compareDirectories" +
        "method that did not provide a path";
    }


    for(var i = 0; i < fileList1.length; i++){
        var fileName = fileList1[i];
        var data = fs.statSync(path1 + "/" + fileName);
        state1[fileName] = data;
    }

    for(var i = 0; i < fileList2.length; i++){
        var fileName = fileList2[i];
        var data = fs.statSync(path2 + "/" + fileName);
        state2[fileName] = data;
    }

    var directoriesMatch = state1.length === state2.length;
    if(directoriesMatch){
        for(var name in state1){
            var fstate1 = state1[name];
            var fstate2 = state2[name];

            if(!fstate2){
                directoriesMatch = false;
                break;
            }
            else if(fstate1.size != fstate2.size){
                directoriesMatch = false;
                break;
            }
        }
    }

    return directoriesMatch;
}

function getDirectoryInfo(path){
    var files = fs.readdirSync(path);

    return {
        fileList:files,
        path:path
    }
}

var directoryState1 = getDirectoryInfo("./test-data");
var directoryState2 = getDirectoryInfo("./test-data");

var match = compareDirectories(directoryState1, directoryState2);
if(match){
    console.log("Test passed");
}
else {
    console.log("WTF?")
}