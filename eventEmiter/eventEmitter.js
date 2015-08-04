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
    if(eventName.indexOf('.')){

        obj.main = eventName.split('.')[0];
        obj.fenzhi = [eventName.split('.')[1]];
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
            this._events[_eventName.main][_eventName.fenzhi] = fn;
        }else{
            if(!this._events[_eventName.main][_eventName.fenzhi]){
                this._events[_eventName.main][_eventName.fenzhi] = fn;
            }else{
                if(typeof this._events[_eventName.main][_eventName.fenzhi] == 'function')
                    this._events[eventName]  = [this._events[eventName] ,fn];
                else if(this._events[_eventName.main][_eventName.fenzhi] instanceof Array){
                    this._events[_eventName.main][_eventName.fenzhi].push(fn)
                }
            }
        } 
    }  
}
eventEmitter.prototype.off = function(eventName,fn){
    var _eventName = namespace(eventName);
    if(typeof _eventName == 'string'){
        var cbks = this._events[eventName];
        if(!cbks || isNone(cbks)){
            this.error();
        }else if(cbks){
            if(typeof cbks == 'function'){
                delete cbks;
            }else if(cbks instanceof Array){
                var posi = cbks.indexOf(fn);
                cbks.splice(posi,1);
            }
        }else if(!isNone(cbks)){
            for(var fenzhi in cbks){
                delete cbks[fenhi];
            }
            delete cbks;
        }

    }else if(typeof _eventName == 'object'){
        var cbks = this._events[_eventName.main][_eventName.fenzhi];
        if(!cbks){
            this.error();
        }else if(typeof cbks == 'function'){
            delete cbks;
        }else if(cbks instanceof Array){
            var posi = cbks.indexOf(fn);
            cbks.splice(posi,1);
        }
    }
}
eventEmitter.prototype.emit = function(eventName){
    // var _eventName = namespace(eventName);
    // if(typeof _eventName == 'string'){
        
    // }else if(typeof _eventName == 'object'){
        
    // }    





    var cbks = this._events[eventName];
    if(!cbks){
        this.error();
    }else if(typeof cbks == 'function'){
        cbks();
    }else if(cbks instanceof Array){
        for(var i = 0;i<cbks.length;i++){
            cbks[i]();
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
eventEmitter.prototype.error = function(){
    console.error('该事件未设置回调函数');
}