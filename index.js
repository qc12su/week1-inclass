var fs = require('fs')


function filesMatch(fstate1,fstate2){

    var filesMatch = (fstate2) && (fstate1.size == fstate2.size);

    return filesMatch;
}


function captureDirectoryState(directoryInfo){
    var state = {};

    var fileList = directoryInfo.fileList;
    var path = directoryInfo.path;

    for(var i = 0; i < fileList.length; i++){
        var fileName = fileList[i];
        var data = fs.statSync(path + "/" + fileName);
        state[fileName] = data;
    }

    return state;
}

function compareDirectories(directoryInfo1, directoryInfo2){

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


    var state1 = captureDirectoryState(directoryInfo1);
    var state2 = captureDirectoryState(directoryInfo2);


    var directoriesMatch = state1.length === state2.length;
    if(directoriesMatch){
        for(var name in state1){
            var fstate1 = state1[name];
            var fstate2 = state2[name];

            if(!filesMatch(fstate1,fstate2)) {
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