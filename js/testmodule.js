ModuleLoad.define( 'js/testmodule' , ['js/testmodule2'] , function(require , exports){
    var testmodule2 = require('js/testmodule2')
        testmodule2.test();
    exports.test = function(){
        console.log(111)
    }
})