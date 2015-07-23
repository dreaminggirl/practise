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
        description : 'HHHH'
    },
    {
        name : 'g',
        description : 'GGGG'
    }
],
    g = function(id){
        if(id.substr(0,1) == '.'){
            return document.getElementsByClassName(id.substr(1));
        }else{
            return document.getElementById(id);
        }
    },
    getOne= function(len,arr){  
        var a = Math.floor((len-1)*Math.random());
        if(arr){
            for(var i in arr){
                if(a == arr[i])
                    return getOne(len,arr)
            }
            return a;
        }else{
            return a;
        }     
    },
    getThree = function(){
        var result = [];
        for(var i =0;i<3;i++){
            result.push(getOne(user.length,result))
        }
        return result;
    },
    addFowlers = function(tpl){
        var tpl = g('tpl_fol').innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
        var out_tpl = [];
        var result = getThree();
        for(i in result){
            var _html = tpl.replace(/{{name}}/g,user[result[i]].name)
                            .replace(/{{des}}/g,user[result[i]].description)
                            .replace(/{{i}}/g,i);
            out_tpl.push(_html);
        }
        g('tpl_fol').innerHTML = out_tpl.join('');
        return result;
    },
    addOneFowler = function(num,now,_now,tpl_li){
        var q = getOne(user.length,_now);
        now[num] = q;
        var out_li = tpl_li.replace(/{{name}}/g,user[q].name)
                            .replace(/{{des}}/g,user[q].description)
                            .replace(/{{i}}/g,num);
        var li = document.createElement('li');
        li.className = 'iterm-'+num+' iterm';
        li.innerHTML = out_li;
        return li;

    },
    delFowler = function(now,tpl_li){
       return function(){
        var num = this.getAttribute("data-i");
        var _now =[];
        for(var i=0;i<now.length;i++){_now[i] = now[i];}

        g('tpl_fol').removeChild(g('.iterm-'+num)[0]);
        delete now[num];
        var new_li = addOneFowler(num,now,_now,tpl_li);
        var close = new_li.getElementsByClassName('del')[0];
        close.addEventListener('click',delFowler(now,tpl_li),false);
        g('tpl_fol').appendChild(new_li);
       }
    };
    (function(){
        var tpl = g('tpl_fol').innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
        var tpl_li = g('.iterm')[0].innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
        var now = addFowlers(tpl);
        var del = g('.del');
        for(var i = 0;i<3;i++){
            del[i].addEventListener('click',delFowler(now,tpl_li),false);
        }

    })()



























