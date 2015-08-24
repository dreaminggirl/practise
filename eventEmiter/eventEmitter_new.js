/**
 * 支持冒泡
 * 支持多级命名空间
 * 支持停止事件的回调函数
 * this.stopBrother = true;
 * 支持阻止事件冒泡
 * this.stopPropagation = true;
 *
 */
var EventEmitter = function(){
    this._events = {};
};
var Ev = function(){
    this.stopP = false ;
    this.stopS = false ;
};
Ev.prototype = {
    stopPropagation : function (){
        this.stopP = true;
    },
    stopSibling : function (){
        this.stopS = true ; 
    }
}

var getName = function( eventName , obj ){
    var _eventName = eventName.trim();
    if( !/^[\w]+(\.?\w+)*$/.test(_eventName) ) {
        console.error( '事件名格式有问题！' );
        return;
    };
    if( (_eventName.indexOf('.') + 1) && !checkIn(_eventName.slice(0 , _eventName.lastIndexOf('.')) , obj) ) {
        console.error( _eventName+'的上级命名空间不存在！' );
        return;
    };
    return _eventName;
}
var checkIn = function( eventName , obj ){
    if( (obj instanceof Array) && (obj.indexOf(eventName)+1) ) return true;

    if( !(obj instanceof Array) && (obj instanceof Object) ){
        var arr = eventName.split('.');
        for( var i = 0 ; i < arr.length ; i ++ ){
            if( !(arr[i] in obj) ) return false;
            obj = obj[arr[i]];
        }
        return true;
    };
    return false;
}
var getInObj = function( eventName,_events ){
    var obj ;
    var arr = eventName.split('.');
    var last = arr[arr.length-1];
    for( var i = 0 ; i < arr.length ; i++ ){
        if( !i ){
            obj = _events;
        }else{
            var iterm = arr[i-1];
            obj = obj[iterm];
        }
        var iterm = arr[i];
        !obj[iterm] && (obj[iterm] = {});
    }
    !obj[last][""] && (obj[last][""] = []);
    return {
        obj : obj,
        name : last
    };
}

var excute = function(eventName,opt){
    var _eventName = getName(eventName,opt._events)
    var result = getInObj(_eventName,opt._events);
    var obj = result.obj[result.name];
    var fn = obj[""];
    var e = new Ev();
    var i = 0;
    var b = fn.length;
    while( i < fn.length ){
        b = fn.length;
        fn[i](e);
        if( b == fn.length ) i++;
        if( e.stopS ) break; 
    }
    return e.stopP;
}

EventEmitter.prototype.on = function(eventName,fn){

    var _eventName = getName( eventName , this._events );
    if( !_eventName ) return this;

    var result = getInObj( _eventName , this._events );
    var obj = result.obj[result.name];

    if ( obj[""].indexOf(fn)+1 ) return this;
    obj[""].push(fn);

    return this;

}

EventEmitter.prototype.off = function(eventName,fn){

    var _eventName = getName(eventName,this._events);
    if( !_eventName ) return this;

    if( !checkIn(_eventName,this._events) ) return this;

    var result = getInObj(_eventName,this._events);
    var obj = result.obj[result.name];

    if( fn && !checkIn(fn,obj[""]) ) return this;

    if( fn ){
        obj[""].splice(obj[""].indexOf(fn),1);
    }else{
        for( var iterm in obj ){
            delete obj[iterm];
        }
        delete result.obj[result.name];

    }

    return this;
}

EventEmitter.prototype.emit = function(eventName){

    var _eventName = getName( eventName , this._events );
    if( !_eventName ) return this;

    if( !checkIn( _eventName , this._events ) ) return this;

    if ( excute(_eventName , this ) ) return;

    if( _eventName.indexOf('.') == -1 ) return;

    var index = _eventName.lastIndexOf( '.' );
    var en = _eventName.slice( 0 , index );
    while( index != -1 ){
        excute( en , this )
        index = en.lastIndexOf( '.' );
        en = en.slice( 0 , index );
    }

}

EventEmitter.prototype.once = function(eventName,fn){
     function tmp(e){
        this.off( eventName , _tmp );
        fn( e );
    }
    var  _tmp = tmp.bind( this );  
    return this.on( eventName , _tmp );
}


exports.EventEmitter = EventEmitter;
exports.getName = getName;
exports.checkIn = checkIn;
exports.getInObj = getInObj;




