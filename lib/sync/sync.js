var fs = require('fs')
var _ = require('lodash')


function filesMatchNameAndSize(fstate1,fstate2){

    var filesMatch = filesMatchName(fstate1,fstate2) && (fstate1.size == fstate2.size);

    return filesMatch;
}

function filesMatchName(fstate1,fstate2){

    var filesMatch = (fstate2);

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

function compareDirectoriesOneWay(state1,state2,matcher){
    var directoriesMatch = true;

    var needsCopyingToOtherDirectory = [];

    for(var name in state1){
        var fstate1 = state1[name];
        var fstate2 = state2[name];

        if(!matcher(fstate1,fstate2)) {

            var lastModified1 = fstate1.ctime.getTime();
            var lastModified2 = (fstate2)? fstate2.ctime.getTime() : -1;

            if(lastModified1 > lastModified2){
                needsCopyingToOtherDirectory.push(name);
            }
        }
    }
    return needsCopyingToOtherDirectory;
}

function compare(path1,path2,matcher){
    var directoryState1 = getDirectoryInfo(path1);
    var directoryState2 = getDirectoryInfo(path2);
    return compareDirectories(directoryState1,directoryState2,matcher);
}

function compareDirectories(directoryInfo1, directoryInfo2, matcher){

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


    var syncTo2 =
        compareDirectoriesOneWay(state1,state2,matcher);

    var syncTo1 =
        compareDirectoriesOneWay(state2,state1,matcher);

    return {
        syncToSrc:syncTo1,
        syncToTrg:syncTo2,
        directoriesMatch:function(){
            return syncTo1.length === 0 && syncTo2.length === 0;
        }
    };
}

function getDirectoryInfo(path){
    var files = fs.readdirSync(path);

    return {
        fileList:files,
        path:path
    }
}

module.exports = {
    compare:compare,
    filesMatchName:filesMatchName,
    filesMatchNameAndSize:filesMatchNameAndSize
}




