
var re = /<(\S*?) [^>]*>.*?<\/\1>|<.*? \/>/g;
var b = "<html>vvvasdf<a></a></html>";
var c = "<div>sadfasdf</div>";
var d = "adsfadf<div></div>";


var re2 = /<@(\S*?)[^>]+.*?<\/@\$1>/g;

console.log(re2.test('<@cmslist>sadfasdf</@cmslist>'));
console.log(b.match(re));
console.log(c.match(re));
console.log(d.match(re));
