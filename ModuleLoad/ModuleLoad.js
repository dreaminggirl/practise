/**
 * 模拟模块加载
 */
(function( global ){
    var PATH = 'file:///Users/MLS/dwj/GitHub/Practise/'
    // var PATH = ''
    

    var modules = {} //存储定义的模块的名





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


    var loadScript = function ( id , src ) {
        var script = document.createElement('script')
        var head = document.head
        script.defer = 'defer'
        script.async = 'async'
        script.type = 'text/javascript';
        script.src = PATH + src + '.js'       
        head.appendChild( script ) 
    }

    var createModuleInfo = function( exports , _exports , id , factory ) {
            _exports = isFunOrObj(factory) == 'Function' ? factory( require , exports ) : factory
            if ( _exports ) {
                exports = _exports
            }
            modules[id].info = exports 
    }

    var triggerCreate = function( module ) {

        var arr = module.deps;
        for( var i = 0 ; i < arr.length ;i++ ){
            if ( !modules[ arr[i] ].isOK ){
                return
            }

        }
        var exports = {} 
        var _exports = {}
        module.isOK = true
        createModuleInfo( exports , _exports , module.id , module.factory )
        module.make && (
        module.make.forEach( function( iterm ,index , arr ){
                triggerCreate( modules[ iterm ] )
        } ))
    }



    var require = function( module ) {
        return modules[module].info
    }
    var defineModule = function( id , dependencies , factory ) {
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
                break
            default :
                id = ( typeof id == 'string' ) ? id : ''
                dependencies = Array.isArray( dependencies ) ? dependencies : []
                factory = isFunOrObj( factory ) ? factory : NOOP           
        }
        //2、将依赖存入数组
        !modules[ id ] &&  ( modules[ id ] = {} )
        modules[ id ].id = id
        modules[ id ].deps =  dependencies.length != 0 ? dependencies.slice() : []
        modules[ id ].depsln = modules[id].deps.length
        modules[ id ].isOK = false
        modules[ id ].factory = factory

        //3、加载依赖模块
        
        var _deps = modules[ id ].deps

        if ( !_deps.length ) {
            //表示不存在依赖
            var exports = {} 
            var _exports = {}
            modules[id].isOK = true
            createModuleInfo( exports , _exports , id , factory )
            modules[ id ].make.forEach( function( iterm ,index , arr ){
                triggerCreate( modules[ iterm ] )
            } )
            
        }

        _deps.forEach( function( iterm , index , arr ) {
            !modules[ iterm ] && (modules[ iterm ] ={})
            !modules[ iterm ].make && ( modules[ iterm ].make = [])
            modules[ iterm ].make.push( id )
            loadScript( id , iterm )
        } )                

    }

    global.ModuleLoad = {
        define : defineModule 
    }   
})(this)