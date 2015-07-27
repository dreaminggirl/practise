var user = [
    {
        name : 'Barack Obama',
        description : 'Barack Obama Barack Obama Barack Obama '
    },
    {
        name : 'CNN',
        description : 'CNNCNNCNNCNNCNNCNN'
    },
    {
        name : 'Ellen',
        description : 'EllenEllenEllenEllenEllen'
    },
    {
        name : 'GitHub',
        description : 'GitHubGitHubGitHubGitHubGitHub'
    },
    {
        name : 'Google Play',
        description : 'Google PlayPlayPlayPlayPlay'
    },
    {
        name : 'google',
        description : 'googlegooglegooglegooglegoogle'
    },
    {
        name : 'ifanr',
        description : 'ifanrifanrifanrifanrifanr'
    },
    {
        name : 'TED talks',
        description : 'TED talksTED talksTED talksTED talks'
    },
    {
        name : 'twitter',
        description : 'twittertwittertwittertwitter'
    },
    {
        name : 'YouTube',
        description : 'YouTubeYouTubeYouTubeYouTube'
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
    // var values = user.filter(function(iterm,index,array){
    //     return !(index in arr)
    // });
    // console.log(values);
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
    result.forEach(function(iterm,index){
        fowllers.push(new fowller(iterm,true,user[iterm]))
    });
    console.log(fowllers,'first');
    ul.innerHTML = replaceTpl(tpl,fowllers);
    return fowllers;
},
followersToindex = function(){
    var filter = [];
    fowllers.forEach(function(iterm,index,fowllers){
        filter.push(iterm.index);
    })
    return filter;
}
addOneFowler = function(num){
    var filter = followersToindex(fowllers);
    var li = document.createElement('li');
    if(filter.length < user.length){       
        var q = createOne(user.length,filter);
        fowllers.push(new fowller(q,true,user[q])); 
        li.className = 'iterm-'+num+' iterm';
        li.innerHTML = replaceTpl(tpl_li,[fowllers[fowllers.length-1]],num);       
    }else{
        li.className = 'showNo';
        li.innerHTML = '没有更多啦';
        end = true;
        
    }
    return li;   
},
delFowler = function(){
   return function(){
        if(event.target.tagName.toLowerCase() == 'i'){
            var num = event.target.getAttribute("data-i");
            fowllers[num].like =false;
            ul.removeChild(document.querySelectorAll('.iterm-'+num)[0]);
            if(!end){
                var new_li = addOneFowler(num);
                ul.appendChild(new_li);
            }            

        }
   }
},
refresher = function(){
    var filter = followersToindex(fowllers);
    var n = (user.length-filter.length)/3>1 ? 3 : (user.length-filter.length)%3;
    var newArr = [];
    
    for(var i =0; i<n;i++){
            var q = createOne(user.length,filter);
            fowllers.push(new fowller(q,true,user[q])); 
            filter = followersToindex(fowllers);
            newArr.push(fowllers[fowllers.length-1]);
       
    }
    if(n){
        ul.innerHTML = replaceTpl(tpl,newArr);
    }else{
        if(!end){
            ul.innerHTML = '<li class="showNo">没有更多啦</li>';
            end =true;
        }      
    }
    
    

},
ul = document.querySelector('#follwers'),
tpl = getTpl('#tpl_content').li.replace(/^\s*/,'').replace(/\s*$/,''),
tpl_li = getTpl('#tpl_content').liCtx.replace(/^\s*/,'').replace(/\s*$/,''),
end = false,
fowllers = [];

    (function(){
        ul.addEventListener('click',delFowler(addFowlers(3)),false);
        var refresh = document.querySelector('#rf');
        refresh.addEventListener('click',refresher,false);
    })()



























