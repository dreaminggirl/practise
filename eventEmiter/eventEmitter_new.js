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
    this.stopP = false;
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

var getName = function(eventName,obj){
    var _eventName = eventName.trim();
    if(!/^[\w]+(\.?\w+)*$/.test(_eventName)) {
        console.error('事件名格式有问题！');
        return;
    };
    if((_eventName.indexOf('.') + 1) && !checkIn(_eventName.slice(0 , _eventName.lastIndexOf('.')) , obj)) {
        console.error(_eventName+'的上级命名空间不存在！');
        return;
    };
    return _eventName;
}

var checkIn = function(eventName,obj){
    if((obj instanceof Array) && (obj.indexOf(eventName)+1)){
        return true
    }else if(obj instanceof Object){
        for(var name in obj){
            if(eventName == name) return true;
        }
    }
    return false;
}

var excute = function(eventName,opt){
    var fn = opt._events[eventName];
    var e =new Ev();
    for(var i = 0;i<fn.length;i++){
        fn[i](e);
        if(e.stopS) break;
    }
    return e.stopP;
}
EventEmitter.prototype.on = function(eventName,fn){
    if(!getName(eventName,this._events)) return this;
    var _eventName = getName(eventName,this._events);
    if(checkIn(eventName,this._events)){
        // console.log(fn,eventName);
        this._events[_eventName].push(fn);
    }else{
        this._events[_eventName] = [fn];
    }
    return this;
}

EventEmitter.prototype.off = function(eventName,fn){
    if(!getName(eventName,this._events)) return this;
    var _eventName = getName(eventName,this._events);
    if(!checkIn(_eventName,this._events)) return this;
    if(fn && !checkIn(fn,this._events[_eventName])) return this;
    if(fn){
        this._events[_eventName].splice(this._events[_eventName].indexOf(fn),1);
    }else{
        delete this._events[_eventName];
        var reg = "^"+_eventName+'\\.'+'\\w+'+"$";
        var pattern = new RegExp(reg);
        while(true){
            for(var name in this._events){
                var i =0;
                if(pattern.test(name)){
                    i++;
                   delete this._events[name];
                }
            }
            if(!i) break;
           reg = reg.slice(0,-1)+'\\.'+'\\w+'+"$"; 
           pattern = new RegExp(reg);
        }
    }
    return this;
}
EventEmitter.prototype.emit = function(eventName){
    if(!getName(eventName,this._events)) return this;
    var _eventName = getName(eventName,this._events);
    if(!checkIn(_eventName,this._events)) return this;

    if(excute(_eventName,this)) return;

    if(_eventName.indexOf('.') == -1) return;

    var index = _eventName.lastIndexOf('.');
    var en = _eventName.slice(0, index);
    while(index != -1){
        excute(en,this)
        index = en.lastIndexOf('.');
        en = en.slice(0, index);
    }

}
EventEmitter.prototype.once = function(eventName,fn){
    function tmp(){
        this.off(eventName,tmp);
        fn();
    }
    this.on(eventName,tmp.bind(this));
    return this;
}
