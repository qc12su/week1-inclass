var _ = require('lodash')

var test = require('./lib/test/expect').test;
var sync = require('./lib/sync/sync');
var Pipeline = require('./lib/sync/pipeline').Pipeline;

var directory1 = "./test-data/folder1";
var directory2 = "./test-data/folder2";

test({name:"Sync Module"}, function(tester) {
    tester.expectThat(
        {
            check: function () {
                return sync.compare(directory1, directory2, sync.filesMatchNameAndSize).directoriesMatch();
            },
            expectedValue: false,
            msg: "Directories with files that are the same name but different sizes shouldn't match"
        }
    ).expectThat(
        {
            check: function () {
                return sync.compare(directory1, directory2, sync.filesMatchName).directoriesMatch();
            },
            expectedValue: false,
            msg: "Directories with files that are the same name but different sizes should match"
        }
    ).expectThat(
        {
            check: function () {
                var rslt = sync.compare(directory1, directory2, sync.filesMatchName);
                return rslt.syncToSrc.length === 1 && rslt.syncToSrc[0] === "test2.txt";
            },
            expectedValue: true,
            msg: "The src should need test2.txt sync'd to it"
        }
    ).expectThat(
        {
            check: function () {
                return sync.compare(directory1, directory2, sync.filesMatchNameAndSize);
            },
            expectedValue: function (rslt) {
                var hasTest = _.contains(rslt.syncToSrc, "test.txt");
                var hasTest2 = _.contains(rslt.syncToSrc, "test2.txt");
                var nothingNeedsSyncingToFolder2 = (rslt.syncToTrg.length == 0);

                return hasTest && hasTest2 && nothingNeedsSyncingToFolder2;
            },
            msg: "folder1 should need test2.txt and test.txt sync'd to it, but folder2 shouldn't need anything sync'd"
        }
    ).expectThat(
        {
            check:function(){
                return sync.getProtocol("foo://asdf.com?asdf3=2")
            },
            expectedValue:"foo",
            msg: "protocols are parsed correctly from full uris"
        }
    ).expectThat(
        {
            check:function(){
                return sync.getProtocol("/foo/bar")
            },
            expectedValue:"file",
            msg: "protocols are defaulted to file if no scheme is present in the uri"
        }
    )
});


test({name:"Pipeline Module"}, function(tester) {

        var myPipeline = new Pipeline();
        myPipeline.addAction({
            exec: function (data) {
                return data + 1;
            }
        });

        tester.expectThat(
        {
            check: function () {
                return myPipeline.exec(0);
            },
            expectedValue: function (rslt) {
                var hasResult = (rslt.result);
                var hasHistory = (rslt.history);
                var resultIs1 = rslt.result === 1;
                var historyHas2Items = (rslt.history.length === 2);
                var historyHasCorrectItems = (rslt.history[0] === 0 && rslt.history[1] === 1);

                return hasResult && hasHistory && resultIs1 && historyHas2Items && historyHasCorrectItems;
            },
            msg: "folder1 should need test2.txt and test.txt sync'd to it, but folder2 shouldn't need anything sync'd"
        }
    );
});