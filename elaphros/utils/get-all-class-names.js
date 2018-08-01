var all = document.getElementsByTagName("*");
var uClasses = new Set();

for (var i=0, max=all.length; i < max; i++) {
  all[i].classList.forEach(function(c) { uClasses.add(c); });
}

var a = [];

uClasses.forEach(function(c) {
  a.push(c);
});

console.log(a);
