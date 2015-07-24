var user = [
    {
        name : 'a',
        description : 'AAAA'
    },
    {
        name : 'b',
        description : 'BBBB'
    },
    {
        name : 'c',
        description : 'CCCC'
    },
    {
        name : 'd',
        description : 'DDDD'
    },
    {
        name : 'e',
        description : 'EEEE'
    },
    {
        name : 'f',
        description : 'FFFF'
    },
    {
        name : 'g',
        description : 'GGGG'
    },
    {
        name : 'h',
        description : 'HHHH'
    },
    {
        name : 'i',
        description : 'IIII'
    },
    {
        name : 'j',
        description : 'JJJJ'
    }
];
fowller = function(index,bol,ctx){
    this.index = index;
    this.like = bol;
    this.ctx = ctx;
}
getTpl = function(selector){
        var str = document.querySelector(selector).innerHTML;
        return {
            liCtx : str,
            li : '<li  class="iterm-{{i}}  iterm">' + str + '</li>'
        }
},
createOne = function(len,arr){  
    var a = Math.floor((len)*Math.random());
    if(arr){
        for(var i = 0;i < arr.length;i++){
           if(a == arr[i]){                
                return createOne(len,arr);
            } 
        }
    }
    return a;   
},
createMore = function(total){ 
    var result = [];
    for(var i =0;i<total;i++){
        result.push(createOne(user.length,result))
    }
    return result;
},
replaceTpl = function(tpl,fowllers,n){
    var out_tpl = [] , _html;
    fowllers.forEach(function(iterm,index){
        _html = tpl.replace(/{{name}}/g,iterm.ctx.name)
                    .replace(/{{des}}/g,iterm.ctx.description)
                    .replace(/{{i}}/g,n||index);
        out_tpl.push(_html); 
    })
    return out_tpl.join('');

},
addFowlers = function(total){    
    var result = createMore(total);
    var fowllers = [];
    result.forEach(function(iterm,index){
        fowllers.push(new fowller(iterm,true,user[iterm]))
    });
    ul.innerHTML = replaceTpl(tpl,fowllers);
    return fowllers;
},
addOneFowler = function(num,arr){
    var filter = [];
    arr.forEach(function(iterm,index,arr){
        filter.push(iterm.index);
    }) 
    var li = document.createElement('li');
    if(filter.length < user.length){       
        var q = createOne(user.length,filter);
        arr.push(new fowller(q,true,user[q])); 
        li.className = 'iterm-'+num+' iterm';
        li.innerHTML = replaceTpl(tpl_li,[arr[arr.length-1]],num);       
    }else{
        li.className = 'showNo';
        li.innerHTML = '没有更多啦';
        end = true;
        
    }
    return li;   
},
delFowler = function(arr){
   return function(){
        if(event.target.tagName.toLowerCase() == 'i'){
            var num = event.target.getAttribute("data-i");
            arr[num].like =false;
            ul.removeChild(document.querySelectorAll('.iterm-'+num)[0]);
            if(!end){
                var new_li = addOneFowler(num,arr);
                ul.appendChild(new_li);
            }            

        }
   }
},
ul = document.querySelector('#follwers'),
tpl = getTpl('#tpl_content').li.replace(/^\s*/,'').replace(/\s*$/,''),
tpl_li = getTpl('#tpl_content').liCtx.replace(/^\s*/,'').replace(/\s*$/,''),
end = false;

    (function(){
        var firstFowllers = addFowlers(3);
        ul.addEventListener('click',delFowler(firstFowllers),false);
    })()



























