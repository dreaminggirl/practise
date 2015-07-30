var lrc1 = " \n[00:01.47]太早\n[00:03.46]演唱：刘允乐\n[00:07.46]\n[00:28.34]我知道 你装成听不到\n[00:34.74]我也能知道 我的你都不要\n[00:42.13]我知道我都知道\n[00:46.17]只是分手预兆\n[00:49.77]却还要讨你不停的笑\n[00:55.55]\n[00:56.03]我知道 就快没完没了\n[01:02.00]你对我的好 都来不及回报\n[01:09.27]你知道我不知道\n";
var lrc2 = "[01:13.33]该用什么计较\n[01:16.75]去换每一个天黑的拥抱\n[01:23.75]\n[01:24.63]我明知道你走的太早\n[01:31.39]还要为你帮他买对车票\n[01:38.54]有谁知道我的神魂颠倒\n[01:45.23]至少值得你背着我偷笑\n[02:01.17]\n[02:02.43]我知道 就快没完没了\n[02:09.10]你对我的好 都来不及回报\n[02:16.27]你知道我不知道\n[02:20.34]该用什么计较\n[02:23.82]去换每一个天黑的拥抱\n";
var lrc3 = "[02:30.32][02:30.93]我明知道你走的太早\n[02:37.52]还要为你帮他买对车票\n[02:44.48]有谁知道我的神魂颠倒\n[02:51.45]至少值得你背着我偷笑\n[02:57.84]\n[02:58.51]我明知道你走的太早\n[03:05.37]还要提前祝你们白头偕老\n[03:12.30]谁都知道会有这么一朝\n[03:19.35]不管多糟我都还是想要\n[03:25.56]\n[03:26.35]不管多糟我都还是想要\n[03:31.88]\n";
var lrc = lrc1+lrc2+lrc3;
var parseLrc = function parseLrc (){

    //将文本分隔成一行行的存入数组
    var lines = lrc.split('\n'),  
        //用于匹配时间的正则表达式
        pattern = /\[\d{2}:\d{2}\.\d{2}\]/g,
        //保存最终结果的数组
        result = [];
    //去掉不含时间的行
    while(!pattern.test(lines[0])){
        lines = lines.slice(1);
    }
    //将最后一个空元素去掉
    lines[lines.length-1].length === 0 && lines.pop();
    console.log(lines);

    lines.forEach(function(iterm,index,arr){
        //提取时间
        var time = iterm.match(pattern);
        //提取歌词
        var v = iterm.replace(pattern,'');
        //因为时间可能有多个 需要逐个遍历 并未每个时间附上相同的歌词
        time.forEach(function(iterm1,index1,arr1){
            //去掉时间两边的[],并按照：分隔成分钟和秒
            var t = iterm1.slice(1, -1).split(':');
            //将结果整理加入数组
            result.push([parseInt(t[0],10)*60 + parseFloat(t[1]),v]);
        })
    })
    //按照时间，将歌词排序
    var result = result.sort(function(a,b){return a[0]-b[0]});
    console.log(result);
    return result;

};
var loadLrc = function loadLrc (list){
    result.forEach(function(iterm,index,arr){
        var p = document.createElement('p');
        p.dataset.index = index;
        p.innerHTML = result[index][1] ? result[index][1] : '~';

        list.appendChild(p);
    })
};
var result = parseLrc();
(function(){
   
    var audio = document.getElementsByTagName('audio')[0];
    var danci = document.getElementById('danci');
    var list = document.getElementById('list');
    loadLrc(list);
    audio.ontimeupdate = function(e){
        var _this = this;
        
        result.forEach(function(iterm,index,arr){
            
            if(_this.currentTime > iterm[0]-1){
                result.forEach(function(iterm,index,arr){
                    danci.getElementsByTagName('p')[index].style.color = '#fff';
                })
                var target = danci.getElementsByTagName('p')[index];
                target.style.color = 'black';
                var ss = -(index-4 )* 30 +'px';
                list.style.marginTop = index>5 && index<(arr.length-11)? -(index-5)* 30 +'px' : (index > 5 ? -(arr.length-16)*30+'px' : 0);

            }
        })
    }
})()




