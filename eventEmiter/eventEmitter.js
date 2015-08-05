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
}
EventEmitter.prototype.off = function(eventName,fn){
    var main = namespace(eventName).main;
    var branch = namespace(eventName).branch;
    var _main = this._events[main];
    if(!_main ) return;
    if(!branch.length){
        //删除全部
        if(_main['']){

        }else if(){
            
        }

    }else{
        var posi = _main[branch].indexOf(fn);
            _main[branch].splice(posi,1);
    }

    var _eventName = namespace(eventName);
    if(typeof _eventName == 'string'){
        var cbks = this._events[eventName];
        if(!cbks) return;           
        if(cbks instanceof Array || typeof cbks == 'function'){
            if(typeof cbks == 'function'){
                delete this._events[eventName];
            }else{
                var posi = cbks.indexOf(fn);
                cbks.splice(posi,1);
            }
        }else if(typeof cbks == 'object' && !isNone(cbks)){
            for(var branch in cbks){
                delete this._events[eventName][branch];
            }
            delete this._events[eventName];
        }

    }else if(typeof _eventName == 'object'){
        var cbks = this._events[_eventName.main][_eventName.branch];
        if(!cbks) return;
        if(typeof cbks == 'function'){
            delete this._events[_eventName.main][_eventName.branch];
        }else if(cbks instanceof Array){
            var posi = cbks.indexOf(fn);
            cbks.splice(posi,1);
        }
    }
}
EventEmitter.prototype.emit = function(eventName){
    var _eventName = namespace(eventName);
    if(typeof _eventName == 'string'){
        var cbks = this._events[eventName];
        if(!cbks) return;
        if(typeof cbks == 'function') {
           cbks(); 
        }
        else if(cbks instanceof Array){
            for(var i = 0;i<cbks.length;i++){
                cbks[i]();
            }
        }else if(!isNone(cbks)){
            for(var branch in cbks){
                cbks[branch]();
            }
        }
    }
    else if(typeof _eventName == 'object'){
        var cbks = this._events[_eventName.main][_eventName.branch];
        if(!cbks) return;
        if(typeof cbks == 'function'){
            cbks();
        }else if(cbks instanceof Array){
            for(var i = 0;i<cbks.length;i++){
                cbks[i]();
            }
        }       
    }    

}
EventEmitter.prototype.once = function(eventName,fn){
    var that = this;
    function temporary(){
        that.off(eventName,linshi);
        fn();
    }
    this.on(eventName,temporary);
}
