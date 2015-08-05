var eventEmitter = function(){
    this._events = {};
};
var isNone = function(obj){
    var hasAttr = true;
    for(var i in obj){
        hasAttr = false;
        break;
    }
    return hasAttr;
}
//hander.one hander.two
var namespace = function(eventName){
    var obj = {};
    if(eventName.indexOf('.')!= -1){
        obj.main = eventName.split('.')[0];
        obj.branch = [eventName.split('.')[1]];
        return obj;
    }else{
        return eventName;
    }
}
eventEmitter.prototype.on = function(eventName,fn){
    var _eventName = namespace(eventName);
    if(typeof _eventName == 'string'){
        if(!this._events[eventName]){
            this._events[eventName] = fn;
        }else if( typeof this._events[eventName]  == 'function'){
            this._events[eventName]  = [this._events[eventName] ,fn];
        }else if(this._events[eventName]  instanceof Array){
            this._events[eventName] .push(fn);
        }
    }else if(typeof _eventName == 'object'){
        if(!this._events[_eventName.main]){
            this._events[_eventName.main] = {};
            this._events[_eventName.main][_eventName.branch] = fn
        }else{
            if(!this._events[_eventName.main][_eventName.branch]){
                this._events[_eventName.main][_eventName.branch] = fn;
            }else{
                if(typeof this._events[_eventName.main][_eventName.branch] == 'function')
                    this._events[eventName]  = [this._events[eventName] ,fn];
                else if(this._events[_eventName.main][_eventName.branch] instanceof Array){
                    this._events[_eventName.main][_eventName.branch].push(fn)
                }
            }
        } 
    }  
}
eventEmitter.prototype.off = function(eventName,fn){
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
eventEmitter.prototype.emit = function(eventName){
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
eventEmitter.prototype.once = function(eventName,fn){
    var that = this;
    function linshi(){
        that.off(eventName,linshi);
        fn();
    }
    this.on(eventName,linshi);
}
