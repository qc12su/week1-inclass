

var testNumber = 1;

function expectThat(test){
    var check = test.check;
    var expectedValue = test.expectedValue;
    var msg = test.msg;

    var exception = null;
    var actualValue = null;

    try{
        actualValue = check();
    }catch(ex){
        exception = ex;
    }

    if(!exception && (expectedValue === actualValue)){
        console.log("Test "+testNumber+" passed");
    }
    else if(exception){
        console.log("Test "+testNumber+" failed");
        console.log("At: "+exception.stack);
        console.log("[\n\t"+msg+"\n]");
    }
    else {
        console.log("Test "+testNumber+" failed");
        console.log("[\n\t"+msg+"\n]");
    }

    testNumber++;
}

module.exports = {
    expectThat:expectThat
}