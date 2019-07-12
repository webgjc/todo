var objs = document.getElementsByTagName("h3");
for (var i = 0; i < objs.length; i++) {
    objs[i].parentElement.setAttribute('target', '_blank');
}

var objs = document.querySelectorAll('h3.r a');
for (var i = 0; i < objs.length; i++) {
    objs[i].setAttribute('target', '_blank');
}
console.log('已处理谷歌超链接！');