/**
 * 模拟模块加载
 */
(function(global){
    var PATH = 'file:///Users/MLS/dwj/GitHub/Practise/'
    // var PATH = ''
    var moudles = {}
    var isFunOrObj = function( obj ) {
         var str = Object.prototype.toString.call(obj).slice( 8 , -1 )
         if ( str == 'Object' || str == 'Function') {
            return str
         }
         return false
    }

    var NOOP = function () {
        return true
    }


    var loadScript = function ( id , src , cbk) {
        var script = document.createElement('script')
        var head = document.head
        script.defer = 'defer'
        script.async = 'async'
        script.type = 'text/javascript';
        script.src = PATH + src + '.js'       
        if ( cbk ) {
            script.onload = script.onreadystatechange = function(){
                var state = this.readyState 
                if ( !state || state == 'loaded' || state == 'complete' ) {
                    moudles[id].depsln --
                    cbk() 
                }
            }
        }
        head.appendChild(script) 
    }

    var require = function( moudle ) {
        return moudles[moudle].info
    }
    var defineMoudle = function( id , dependencies , factory ) {
        //1、判断参数 
        switch ( arguments.length ) {
            case 0 :
                throw Error ('define(id?, dependencies?, factory)请输入必填参数factory')
            case 1 : 
                factory = isFunOrObj( id ) ? id : NOOP
                id = ''
                dependencies = []
                break
            case 2 :
                factory = isFunOrObj( dependencies ) ? dependencies : NOOP
                dependencies = Array.isArray( id ) ? id : []
                id = ''
            default :
                id = ( typeof id == 'string' ) ? id : ''
                dependencies = Array.isArray( dependencies ) ? dependencies : []
                factory = isFunOrObj( factory ) ? factory : NOOP           
        }
        //2、将依赖存入数组
        moudles[id] = {}
        moudles[id].deps =  dependencies.length != 0 ? dependencies.slice() : []
        moudles[id].depsln = moudles[id].deps.length
        //3、加载依赖模块
        
        var exports = {} 
        var _exports = {}
        var _deps = moudles[id].deps

        if ( !_deps.length ) {
           _exports = isFunOrObj(factory) == 'Function' ? factory( require , exports ) : factory
            if ( _exports ) {
                exports = _exports
            }
            moudles[id].info = exports 
        }

        _deps.forEach( function( iterm , index , arr ) {
            loadScript( id , iterm , function(){
                if ( !moudles[id].depsln ) {
                    
                    //factory : exports return obj
                    _exports = isFunOrObj(factory) == 'Function' ? factory( require , exports ) : factory
                    if ( _exports ) {
                        exports = _exports
                    }
                    moudles[id].info = exports

                }
            })
        } )                

    }

    global.MoudleLoad = {
        define : defineMoudle 
    }   

})(this)