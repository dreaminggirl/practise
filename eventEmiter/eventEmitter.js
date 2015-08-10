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
    var _eventName = eventName.split('.');
    return {
        main : _eventName[0],
        branch : _eventName[1] || '' 
    }
}
EventEmitter.prototype.on = function(eventName,fn){
    var _eventName = namespace(eventName);
    var main = _eventName.main;
    var branch = _eventName.branch;
    !this._events[main] && (this._events[main] = {});
    var _main = this._events[main];
    if(_main && _main[branch]){
        _main[branch].push(fn)
    }else{
        _main[branch] = [fn]
    } 
    return this;

}
EventEmitter.prototype.off = function(eventName,fn){
    var _eventName = namespace(eventName);
    var main = _eventName.main;
    var branch = _eventName.branch;
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
    var _eventName = namespace(eventName);
    var main = _eventName.main;
    var branch = _eventName.branch;
    var _main = this._events[main];
    if(!_main ) return;
    if(!_main[branch]) return;
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
