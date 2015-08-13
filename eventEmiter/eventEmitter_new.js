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
    this.stopPropagation = false;
    this.stopBrother = false;
};

var checkName = function(eventName){
    return (/^[\w]([\w\.]*)[\w]$/.exec(eventName.trim()))[0];
};

var checkInObj = function(eventName,obj){
    for(var name in obj){
        if(eventName == name) return true;
    }
    return false;
};

var checkInArr = function(eventName,arr){
    for(var name of arr){
        if(eventName == name) return true;
    }
    return false;
};

var checkNameBefore = function(eventName,obj){
    return checkInObj( eventName.slice(0, eventName.lastIndexOf('.')) ,obj);  
};

var excute = function(eventName,opt){
    for(var i = 0;i<opt._events[eventName].length;i++){
        opt._events[eventName][i]();
        if(opt.stopBrother) break;
    }
}
EventEmitter.prototype.on = function(eventName,fn){
    if(!checkName(eventName)) return;
    if( (eventName.indexOf('.')+1) && !checkNameBefore(eventName,this._events)) return;
    if(checkInObj(eventName,this._events)){
        this._events[eventName].push(fn);
    }else{
        this._events[eventName] = [fn];
    }
    return this;
}

EventEmitter.prototype.off = function(eventName,fn){
    if(!checkName(eventName)) return;
    if(!checkInObj(eventName,this._events)) return;
    if(fn && !checkInArr(fn,this._events[eventName])) return;
    if(fn){
        this._events[eventName].splice(this._events[eventName].indexOf(fn),1);
    }else{
        delete this._events[eventName];
        var reg = "^"+eventName+'\\.'+'\\w+'+"$";
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
    if(!checkName(eventName)) return;
    if(!checkInObj(eventName,this._events)) return;

    excute(eventName,this);
    if(this.stopPropagation) return;

    if(eventName.indexOf('.') == -1) return;

    var index = eventName.lastIndexOf('.');
    var en = eventName.slice(0, index);
    while(index != -1){
        excute(en,this)
        index = en.lastIndexOf('.');
        en = en.slice(0, index);
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
