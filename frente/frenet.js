(function( global ){
    /**
     * 如果传递了cnt，
     * cnt 有可能是object类型，字符串（选择器，innerHTML ）,或空
     *
     */
    global.$ = function( cnt ){
        if ( !cnt ) { cnt = '' }
        // if ( !( this instanceof $ ) ) { return new $( cnt ) }
        if ( typeof cnt == 'string' ) {
            cnt = cnt.trim()
            if ( cnt.match(/^[^<]/) ) {
                return makeInResult( document.querySelectorAll( cnt ) , cnt )
            } else if ( cnt.match(/^[<]/) ) {
                var dc = document.createDocumentFragment()
                var div = document.createElement('div')
                dc.appendChild( div )
                div.setAttribute('id','createDiv')
                div.innerHTML = cnt
                return makeInResult( dc.getElementById('createDiv').children )
            }
        } else if ( typeof cnt == 'object' ) {
            if ( $.isObject( cnt ) ) {
                cnt = [ cnt ]
            }
            var pro = Object.getPrototypeOf( cnt )
            return makeInResult( cnt , '' , $.extendProto( pro , $.prototype) )
        }
        return this
    }

    function makeInResult( arr , cnt , pro ) {
        var obj = Object.create( pro || $.prototype )
        obj.length = arr.length
        cnt && ( obj.selector = cnt )
        obj.splice = Array.prototype.splice
        for( var i =0 ; i < arr.length ; i++ ){
            obj[i] = arr[i]
        }
        return obj
    }
    function checkObj( obj ) {
        return Object.prototype.toString.call( obj ) == "[object Object]"
    }
    $.extend = function(  ) {
        var length = arguments.length
        if ( !arguments[0] ) return new Object()
        if ( arguments[0] && !arguments[1] ) return arguments[0]
        var obj = new Object()
        for( var i = 0 ; i < arguments.length ; i++ ){
            $.each( arguments[i] ,function( key , val ){
                if ( !obj.hasOwnProperty( key ) )
                    obj[ key ] = val;
            } )
        }
        return obj
    }
    //写的  有问题
    $.extendProto = function(){
        var length = arguments.length
        if ( !arguments[0] ) return new Object()
        if ( arguments[0] && !arguments[1] ) return arguments[0]
        var obj = new Object()
        for( var n = 0 ; n < arguments.length ; n++ ){
            var o = Object.getOwnPropertyNames( arguments[n] )
            var length =o.length
            for( var i = 0 ; i < length ; i ++ ){
                if ( !obj.hasOwnProperty( o[i] ) )
                    obj[ o[i] ] = arguments[n][ o[i] ];
            }
        }
        return obj
    }
    $.isArray = function( obj ) {
        return Object.prototype.toString.call( obj ) == "[object Array]"
    }
    $.isArrayLike = function( collection ){
        var length = collection && collection.length
        return typeof length == 'number'
    }
    $.isObject = function( obj ) {
        return checkObj(obj)
    }
    $.isFunction = function( func ){
        return Object.prototype.toString.call( func ) == "[object Function]"
    }

    $.each = function( obj , func ) {
        if ( !$.isFunction( func ) ) return
        if ( $.isArrayLike( obj ) ) {
            for( var i = 0 ; i < obj.length ; i++ ){
                func( i , obj[ i ] , obj )
            }
        } else if ( $.isObject( obj ) ) {
            var o = Object.keys( obj )
            var length = o.length
            for( var i = 0 ; i < length ; i ++ ){
                func( o[i] , obj[o[i]] , obj )
            }
        }
        return $
    }

    $.prototype.each = function( func ) {
        $.each( this , func )
        return this
    }
    //有问题
    // $.each(['slice','concat','join'],function( index , val ){
    //     var method = Array.prototype[val]
    //     $.prototype[ val ] = function (){
    //         return method.apply( this , arguments)
    //     }
    // })

    //添加子元素
    $.prototype.append = function( cnt ){
        try{
           $.each( this , function( index , val ){
                $.each( cnt , function( _index , _val ){
                    val.appendChild( _val )
                } )
            } )
           return this
        }catch(e){
            throw Error('参数有误')
        }

    }
    //添加到某个父元素
    $.prototype.appendTo = function( cnt ){
        var that = this
        try{
           $.each( cnt , function( index , val ){
                $.each( that , function( _index , _val ){
                    val.appendChild( _val )
                } )
            } )
           return this
        }catch(e){
            throw Error('参数有误')
        }
    }

    //prepend prependTo
    $.prototype.prepend = function( cnt ){
        try{
            $.each( this , function( index , val , arr ){
                var firstNode = val.firstElementChild
                $.each( cnt , function( _index , _val ){
                    val.insertBefore( _val , firstNode )
                })
            } )
            return this
        }catch(e){
            throw Error('参数有误')
        }
    }
    $.prototype.prependTo = function( cnt ){
        var that = this
        try{
            $.each( cnt , function( index , val , arr ){
                var firstNode = val.firstElementChild
                $.each( that , function( _index , _val ){
                    val.insertBefore( _val , firstNode )
                })
             } )
            return this
        }catch(e){
            throw Error('参数有误')
        }
    }

    //$('#d').after($('<i>e</i>'))在d后i
    $.prototype.after = function( cnt ){
        try{
            $.each( this , function( index , val , arr ){
                var sibling = val.nextElementSibling
                var parent = val.parentElement
                $.each( cnt , function( _index , _val ){
                    parent.insertBefore( _val , sibling )
                })
             } )
            return this
        }catch(e){
            throw Error('参数有误')
        }

    }
    //$('<i>e</i>').insertAfter($('#d'))在d后i
    $.prototype.insertAfter = function( cnt ){
        var that = this
        try{
            $.each( cnt , function( index , val ,arr ){
                var parent = val.parentElement
                var sibling = val.nextElementSibling
                $.each( that , function( _index , _val ){
                    parent.insertBefore( _val , sibling )
                })
             } )
            return this
        }catch(e){
            throw Error('参数有误')
        }

    }
    //before inserBefore
    //remove
    $.prototype.remove = function(){
        $.each( this ,function(  index , val ){
            var parent = val.parentElement
            parent.removeChild( val );
        } )
    }










})( this )