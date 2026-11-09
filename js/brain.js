function $(i){return document.getElementById(i)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var NS="http://www.w3.org/2000/svg",sel=null,query="",data={},svg=$("svg");
REGIONS.forEach(function(r){
  var p=document.createElementNS(NS,"path");p.setAttribute("d",r.d);p.setAttribute("class","r");p.id="p-"+r.id;
  p.setAttribute("tabindex","0");p.setAttribute("aria-label",r.name);
  p.addEventListener("click",function(){pick(r.id)});
  p.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();pick(r.id)}});
  svg.appendChild(p);
});
REGIONS.forEach(function(r){
  var t=document.createElementNS(NS,"text");t.setAttribute("x",r.lx);t.setAttribute("y",r.ly);
  t.setAttribute("class","lbl");if(r.small)t.setAttribute("style","font-size:12px");t.textContent=r.name;svg.appendChild(t);
});
function matches(r){
  if(!query)return true;
  return (r.name+r.en+r.kw+r.hint+(data[r.id]||"")).toLowerCase().indexOf(query.toLowerCase())>-1;
}
function refreshMap(){
  var chips=$("chips");chips.textContent="";
  REGIONS.forEach(function(r){
    var m=matches(r),p=$("p-"+r.id);p.classList.toggle("dim",!m);
    if(m){var c=el("button","chip",r.name);c.onclick=function(){pick(r.id)};chips.appendChild(c)}
  });
  if(!chips.children.length)chips.appendChild(el("span","empty","검색 결과가 없어요."));
  if(window.upd3)window.upd3();
}
function pick(id){location.href="region.html?id="+encodeURIComponent(id)}
$("q").addEventListener("input",function(e){query=e.target.value.trim();refreshMap()});
refreshMap();
Promise.all(REGIONS.map(function(r){return fetch("regions/"+r.id+".md").then(function(x){return x.ok?x.text():""}).catch(function(){return ""}).then(function(t){data[r.id]=t})})).then(refreshMap);
