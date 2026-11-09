// ===== 3D 뇌 (마우스/손가락으로 돌리고, 부위를 누르세요) =====
(function(){
var host=$("three"),tip=document.querySelector(".tip"),t2=$("t2"),t3=$("t3");
function only2d(){$("tg").style.display="none";host.style.display="none";svg.style.display="block"}
if(!window.THREE){only2d();return}
var ren;try{ren=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch(e){only2d();return}
var COL={frontal:"#e9b872",parietal:"#e3a08a",occipital:"#b9a0d6",temporal:"#8fc1a9",cerebellum:"#8db4e0",brainstem:"#c4c4c4",hippocampus:"#f0e35c",amygdala:"#e8607a"};
var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1.33,0.1,50);cam.position.set(0,-0.2,6.2);
scene.add(new THREE.AmbientLight(0xffffff,0.75));
var dl=new THREE.DirectionalLight(0xffffff,0.8);dl.position.set(3,4,5);scene.add(dl);
var g=new THREE.Group();scene.add(g);
function regionOf(x,y){var u=x/1.5;if(u>0.55)return"occipital";if(y<-0.15&&u>-0.45)return"temporal";if(u<0.05)return"frontal";return"parietal"}
// 대뇌
var cg=new THREE.SphereGeometry(1,72,52),pa=cg.attributes.position,vr=[];
for(var i=0;i<pa.count;i++){var x=pa.getX(i),y=pa.getY(i),z=pa.getZ(i);
 y=y<0?y*0.7:y;var X=1.5*x,Y=0.98*y,Z=0.95*z;
 var n=0.035*(Math.sin(9*X+3*Z)*Math.sin(8*Y+2*X)+0.7*Math.sin(11*Z+7*Y));
 X*=1+n;Y*=1+n;Z*=1+n;if(Y>0.3)Y*=1-0.06*Math.exp(-Z*Z*60);
 pa.setXYZ(i,X,Y,Z);vr.push(regionOf(X,Y))}
cg.computeVertexNormals();cg.setAttribute("color",new THREE.BufferAttribute(new Float32Array(pa.count*3),3));
var cm=new THREE.Mesh(cg,new THREE.MeshPhongMaterial({vertexColors:true,transparent:true,opacity:0.82,shininess:25}));
cm.userData.vr=vr;g.add(cm);
var parts=[];
function part(id,geo,pos,sc,rz){var m=new THREE.Mesh(geo,new THREE.MeshPhongMaterial({color:COL[id],shininess:20}));m.position.set(pos[0],pos[1],pos[2]);if(sc)m.scale.set(sc[0],sc[1],sc[2]);if(rz)m.rotation.z=rz;m.userData.region=id;m.userData.inner=(id==="hippocampus"||id==="amygdala");g.add(m);parts.push(m)}
part("cerebellum",new THREE.SphereGeometry(0.6,32,24),[0.95,-0.78,0],[1,0.65,1.1]);
part("brainstem",new THREE.CylinderGeometry(0.17,0.12,1,20),[0.3,-1.1,0],null,0.2);
[-1,1].forEach(function(s){
 part("hippocampus",new THREE.SphereGeometry(0.4,20,14),[0.2,-0.42,0.42*s],[1,0.28,0.35],0.1);
 part("amygdala",new THREE.SphereGeometry(0.15,16,12),[-0.4,-0.45,0.42*s]);
});
var HI=new THREE.Color("#ff8a00"),GR=new THREE.Color("#c8c8c8");
function shade(id){var c=new THREE.Color(COL[id]);var r=REGIONS.filter(function(x){return x.id===id})[0];
 if(sel===id)return HI.clone();if(r&&!matches(r))return c.lerp(GR,0.8);return c}
window.upd3=function(){
 var col=cg.attributes.color,cache={};
 for(var i=0;i<vr.length;i++){var id=vr[i];var c=cache[id]||(cache[id]=shade(id));col.setXYZ(i,c.r,c.g,c.b)}
 col.needsUpdate=true;
 parts.forEach(function(m){m.material.color.copy(shade(m.userData.region))});
};
// 돌리기 + 클릭
var cv=ren.domElement;cv.style.cssText="width:100%;display:block;touch-action:none;cursor:grab;border-radius:12px";host.appendChild(cv);
g.rotation.set(0.1,0,0);
var drag=false,moved=0,lx=0,ly=0,ray=new THREE.Raycaster(),mv=new THREE.Vector2();
cv.addEventListener("pointerdown",function(e){drag=true;moved=0;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)});
cv.addEventListener("pointermove",function(e){if(!drag)return;var dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);g.rotation.y+=dx*0.01;g.rotation.x=Math.max(-1.2,Math.min(1.2,g.rotation.x+dy*0.01))});
cv.addEventListener("pointerup",function(e){drag=false;if(moved>5)return;
 var r=cv.getBoundingClientRect();mv.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);
 ray.setFromCamera(mv,cam);var h=ray.intersectObjects(g.children);if(!h.length)return;
 var pick1=h.filter(function(x){return x.object.userData.inner})[0]||h[0],id;
 id=pick1.object===cm?vr[pick1.face.a]:pick1.object.userData.region;pick(id)});
function size(){var w=host.clientWidth||320,h=Math.round(w*0.8);ren.setSize(w,h,false);cv.style.height=h+"px";cam.aspect=w/h;cam.updateProjectionMatrix()}
window.addEventListener("resize",function(){if(host.style.display!=="none")size()});
var on=false;function loop(){if(!on)return;requestAnimationFrame(loop);ren.render(scene,cam)}
function show(three){on=three;t3.classList.toggle("on",three);t2.classList.toggle("on",!three);
 host.style.display=three?"block":"none";svg.style.display=three?"none":"block";
 tip.textContent=three?"드래그해서 돌려보세요 · 부위를 누르면 설명이 열려요 · 해마·편도체는 안쪽에 있어요":"뇌를 옆에서 본 모습 (왼쪽이 앞) · 해마·편도체는 안쪽에 있어요";
 if(three){size();loop()}}
t2.onclick=function(){show(false)};t3.onclick=function(){show(true)};
window.upd3();show(true);
})();
