(function( global ){
    /*创建dom元素匹配的正则
        reg.exec(str) 的结果，[1]表示dom元素，［2］表示属性列表 ［7］表示标签间的内容
    */
    var reg = /<([a-z]+)((\s+[a-z\-]+\s*=\s*('[0-9a-zA-Z\-:;]+'|"[0-9a-zA-Z\-:;]+"))*)\s*(\/*)>((.*?)<\/[a-z]+>)*/;
    
    function getAtrs( str ) {
        var result = {}
        str.replace(/([a-z\-]+)\s*=\s*('[0-9a-zA-Z\-:;]+'|"[0-9a-zA-Z\-:;]+")/g,function($0,$1,$2){
            result[$1] = $2.slice(1,$2.length-1)
        })
        return result
    }

    function createEle( ele , atrs , content) {
        var element = []
        if ( ele ) {
            element.push( document.createElement( ele ) )
        }
        if ( atrs ) {
            for(var item in atrs){
                element.setAttribute( item , atrs[item] )
            }
        }
        content && ( element.innerHTML = content )
        return element
    }
    global.$ = function( selector ){
        if ( !( this instanceof $ ) ) { return new $( selector ) }
        try {
            this.tag = document.querySelectorAll( selector ) //IE9 

        } catch (e) {
            var arr = reg.exec( selector )
            this.tag = createEle( arr[1] , getAtrs( arr[2] ) ,arr[7] )
        }
        return this
    }
    $.isArray = function( obj ){
        return Object.prototype.toString.call( obj ) == "[object Array]"
    }
    $.isArrayLike = function( collection ){
        var length = collection && collection.length
        return typeof length == 'number' 
    }
    $.isObject = function( obj ){
        return Object.prototype.toString.call( obj ) == "[object Object]"
    }
    $.isFunction = function( func ){
        return Object.prototype.toString.call( func ) == "[object Function]"
    }

    $.each = function( obj , func ){
        if ( !$.isFunction( func ) ) return
        if ( $.isArrayLike( obj ) ) {
            for( var i = 0 ; i < obj.length ; i++ ){
                func( obj[ i ] , i , obj )
            }
        } else if ( $.isObject( obj ) ) {
            var o = Object.keys( obj )
            var length = o.length
            for( var i = 0 ; i < length ; i ++ ){
                func( obj[o[i]] , o[i] , obj )
            }
        } 
        return $
    }

    $.prototype.each = function( func ){
        $.each( this.tag , func )
    }

    $.each(['slice','concat','join'],function( val ){
        var method = Array.prototype[val]
        $.prototype[ val ] = function (){
            return method.apply(this.tag ,arguments)   
        }       
    })
    




    //appendTo append
    $.prototype.append = function( element ){
        $.each( this.tag , function( val , index , arr ){
            $.each( element.tag , function( v ){
                val.appendChild(v)
            })
        } )
    }

    $.prototype.appendTo = function( element ){
        $.each( element.tag , function( val , index , arr ){
            $.each( this.tag , function( v ){
                val.appendChild(v)
            })
        } )
    }

    //prepend prependTo
    $.prototype.prepend = function( element ){
         $.each( this.tag , function( val ,index , arr ){
            var firstNode = val.firstElementChild
            $.each( element.tag , function( v ){
                val.insertBefore( v , firstNode )
            })
         } )
    }
    $.prototype.prependTo = function( element ){
        $.each( element.tag , function( val ,index , arr ){
            var firstNode = val.firstElementChild
            $.each( this.tag , function( v ){
                val.insertBefore( v , firstNode )
            })
         } )
    }

    //after insertAfter
    $.prototype.after = function( element ){
        $.each( element.tag , function( val ,index , arr ){
            var parent = val.parentElement
            $.each( this.tag , function( v ){
                parent.insertBefore( v , val )
            })
         } )
    }
    $.prototype.insertAfter = function( element ){
        $.each( this.tag , function( val ,index , arr ){
            var parent = val.parentElement
            $.each( element.tag , function( v ){
                parent.insertBefore( v , val )
            })
         } )
    }
    //before inserBefore
    //remove
    $.prototype.remove = function(){
        $.each( this.tag ,function( val ){
            var parent = val.parentElement
            parent.removeChild( val );
        } )
    }










})( this )