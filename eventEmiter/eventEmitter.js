var EventEmitter = function(){
    this._events = {};
};
var isNone = function(obj){
    for(var i in obj){
        return false;
    }
    return true;
}
var namespace = function(eventName){
    if(eventName.indexOf('.')!= -1){
        return {
            main : eventName.split('.')[0],
            branch : eventName.split('.')[1]
        };
    }else{
        return {
            main : eventName,
            branch : ''
        };
    }
}
EventEmitter.prototype.on = function(eventName,fn){
    var main = namespace(eventName).main;
    var branch = namespace(eventName).branch;
    this._events[main] ? '' : this._events[main] = {};
    var _main = this._events[main];
    if(_main && _main[branch]){
        _main[branch].push(fn)
    }else{
        if(!_main){
            _main = {};
            _main[''] = [];
            _main[branch] = [fn]
        }else if(!_main[branch]){
            _main[branch] = [fn]
        }
    } 
    return this;
}
EventEmitter.prototype.off = function(eventName,fn){
    var main = namespace(eventName).main;
    var branch = namespace(eventName).branch;
    var _main = this._events[main];
    if(!_main ) return;
    if(fn){
        _main[branch].splice(_main[branch].indexOf(fn),1);
    }else{
        branch == '' ? delete this._events[main] : delete _main[branch] ;
    }
    return this;
}
EventEmitter.prototype.emit = function(eventName){
    var main = namespace(eventName).main;
    var branch = namespace(eventName).branch;
    var _main = this._events[main];
    if(!_main ) return;
    if(!branch){
        for(var name in _main){
            _main[name].forEach(function(iterm,index,arr){iterm();})          
        }
    }else{
        _main[branch].forEach(function(iterm,index,arr){iterm();})  
    }
}
EventEmitter.prototype.once = function(eventName,fn){
    var that = this;
    function temporary(){
        that.off(eventName,temporary);
        fn();
    }
    this.on(eventName,temporary);
    return this;
}
