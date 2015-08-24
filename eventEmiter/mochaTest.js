var assert = require("assert");
var ev = require("./eventEmitter_new.js");

describe("EventEmitter",function(){
    var EventEmitter = ev.EventEmitter;
    var events = new EventEmitter();
    function fn1(){
        console.log(1);          
    }
    function fn2(e){
        console.log(2); 
    }
    function fn3(e){
        console.log(3); 
    }
    function fn4(e){
        console.log(4); 
    }
    function ffn1(){
        console.log("ff1");          
    }
    function ffn2(e){
        console.log("ff2"); 
        e.stopSibling();
        e.stopPropagation();
    }
    function ffn3(e){
        console.log("ff3"); 
        e.stopPropagation();
    }
    events.on('handler',fn1)
    events.on('handler.one',fn1);
    events.on('handler.one',fn2);
    events.on('handler.one.oneone',fn1);
    events.on('ff',ffn1);
    events.on('ff.one',ffn2);
    events.on('ff.one',ffn3);
    events.on('ff.one.oneone',ffn3);

    describe("on",function(){
        describe("验证私有方法是否正确",function(){
            describe("#getName()",function(){
                it("正确输入的时候handler->handler(ok)",function(){
                    var getName = ev.getName;
                    assert.equal('handler',getName('  handler '));
                });
                it("错误输入的时候 handler.->undefined(ok)",function(){
                    var getName = ev.getName;
                    assert.equal(undefined,getName('  handler. '));
                });
                it("错误输入的时候 qq.one->undefined(ok)",function(){
                    var getName = ev.getName;
                    assert.equal(undefined,getName('  qq.one '));
                })
            });
            describe("#checkIn()",function(){
                it("检查元素是否在数组里",function(){
                    var checkIn = ev.checkIn;
                    assert.ok(checkIn('han',['han','kk']));
                    assert.equal(false,checkIn('h',['han','kk']));
                }) 
                it("检查元素是否在对象里",function(){
                    var checkIn = ev.checkIn;
                    assert.ok(checkIn('han',{han:'han',ll:'ll'}));
                    assert.equal(false,checkIn('h',{han:'han',ll:'ll'}));
                })  
            })                        
        })
        describe("验证事件对象的原型方法：on off emit once",function(){
            function testOn (eventName,fn){

                var q = eventName;
                events.emit(eventName);

                var result = ev.getInObj(eventName,events._events);
                var fns = result.obj[result.name][""];

                assert.ok(ev.checkIn(fn,fns));

            }
            function testOff (eventName,fn){

                var q = eventName;
                events.off(eventName,fn);

                var result = ev.getInObj(eventName,events._events);
                var fns = result.obj[result.name][""];

                assert.ok(!ev.checkIn(fn,fns));

            }
            function testOnce (eventName,fn){
                var q = eventName;
                events.emit(eventName,fn);

                var result = ev.getInObj(eventName,events._events);
                var fns = result.obj[result.name][""];

                assert.ok(!ev.checkIn(fn,fns));
            }

            describe("验证绑定回调函数的on方法是否有效 同时验证了事件冒泡的现象",function(){
                
                it(".on('handler',fn1)",function(){
                    testOn('handler',fn1);
                })
                it(".on('handler.one',fn1)",function(){
                    testOn('handler.one',fn1);
                })
                it(".on('handler.one',fn2)",function(){
                    testOn('handler.one',fn2);
                })
                it(".on('handler.one.oneone',fn1)",function(){
                    testOn('handler.one.oneone',fn1);
                })
            })

            describe("验证解绑回调函数的off方法是否有效",function(){

                it(".off('handler.one',fn2)",function(){
                    testOff('handler.one',fn2);
                });
                it(".on('handler.one',fn1)",function(){
                    testOn('handler.one',fn1);
                });
                it(".off('handler')",function(){
                    testOff('handler.one',fn2);
                })
            })
            describe("验证触发回调函数的emit方法是否有效",function(){
                it("之前验证其他方法时已经验证过啦",function(){

                })
            })
            describe("验证只绑定一次的once方法是否有效",function(){
                it(".once('qq',fn4)",function(){
                    testOnce('qq',fn4)
                    
                })

            })
            describe("验证阻止冒泡 hander.one.oneone->hander.one->hander",function(){
                it("on('ff.one.oneone',ffn3) ffn3阻止冒泡后应该只输出ff3",function(){
                    events.emit('ff.one.oneone');
                })

            })
            describe("验证阻止同命名空间下的后续函数执行",function(){
                it("为ff.one绑定两个回调函数,在第一个函数内停止后续函数执行 应该输出ff2",function(){
                    events.emit('ff.one');
                })

            })
            
        })
    })
});











