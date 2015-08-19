var _ = require('lodash')

var expectThat = require('./lib/test/expect').expectThat;
var sync = require('./lib/sync/sync');

var directoryState1 = sync.getDirectoryInfo("./test-data/folder1");
var directoryState2 = sync.getDirectoryInfo("./test-data/folder2");

expectThat(
    {
        check:function(){
            return sync.compareDirectories(directoryState1,directoryState2,sync.filesMatchNameAndSize).directoriesMatch();
        },
        expectedValue:false,
        msg:"Directories with files that are the same name but different sizes shouldn't match"
    }
);

expectThat(
    {
        check:function(){
            return sync.compareDirectories(directoryState1,directoryState2,sync.filesMatchName).directoriesMatch();
        },
        expectedValue:false,
        msg:"Directories with files that are the same name but different sizes should match"
    }
);

expectThat(
    {
        check:function(){
            var rslt = sync.compareDirectories(directoryState1,directoryState2,sync.filesMatchName);
            return rslt.syncToSrc.length === 1 && rslt.syncToSrc[0] === "test2.txt";
        },
        expectedValue:true,
        msg:"The src should need test2.txt sync'd to it"
    }
)

expectThat(
    {
        check:function(){
            return sync.compareDirectories(directoryState1,directoryState2,sync.filesMatchNameAndSize);
        },
        expectedValue:function(rslt){
            var hasTest = _.contains(rslt.syncToSrc, "test.txt");
            var hasTest2 = _.contains(rslt.syncToSrc, "test2.txt");
            var nothingNeedsSyncingToFolder2 = (rslt.syncToTrg.length == 0);

            return hasTest && hasTest2 && nothingNeedsSyncingToFolder2;
        },
        msg:"folder1 should need test2.txt and test.txt sync'd to it, but folder2 shouldn't need anything sync'd"
    }
)
