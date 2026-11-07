(function(){'use strict';
var d=document,H=d.documentElement,W=window;
var $=function(s,r){return (r||d).querySelector(s);},$$=function(s,r){return [].slice.call((r||d).querySelectorAll(s));};
var coarse=W.matchMedia&&W.matchMedia('(pointer:coarse)').matches;
var small=innerWidth<700;
var weak=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2)||(navigator.deviceMemory&&navigator.deviceMemory<=2);
if(weak)H.classList.add('lite');
/* ================= Three.js full page 3D world ================= */
function initThree(){
  var T=W.THREE,cv=$('#bg3d');if(!T||!cv||weak)return;
  var rd;try{rd=new T.WebGLRenderer({canvas:cv,antialias:!small,alpha:false,powerPreference:'low-power'});}catch(e){return;}
  rd.setClearColor(0x040b1c,1);
  var dpr=small?1:Math.min(W.devicePixelRatio||1,1.5);rd.setPixelRatio(dpr);
  var scene=new T.Scene(),cam=new T.PerspectiveCamera(50,1,.1,100);cam.position.z=7.5;
  var NP=small?3600:9500,TAU=Math.PI*2;
  function rnd(){return Math.random();}
  function mk(f){var a=new Float32Array(NP*3);for(var i=0;i<NP;i++){var p=f(i,i/NP);a[i*3]=p[0];a[i*3+1]=p[1];a[i*3+2]=p[2];}return a;}
  var SH=[
   mk(function(i,t){var u=rnd()*TAU,v=rnd()*TAU,R=2.3+(i%3)*.12,r=.12+rnd()*.3;return [(R+r*Math.cos(v))*Math.cos(u),r*Math.sin(v)*1.1,(R+r*Math.cos(v))*Math.sin(u)];}),
   mk(function(i,t){var y=1-2*t,rr=Math.sqrt(1-y*y),th=i*2.399963,s=2.6+(rnd()-.5)*.25;return [Math.cos(th)*rr*s,y*s,Math.sin(th)*rr*s];}),
   mk(function(i,t){var h=(t*2-1)*3.6,a=t*14*Math.PI,s=i%5===0?1:(i%2?1:-1),rr=1.5+(rnd()-.5)*.18;if(i%5===0){var k=rnd();var a2=Math.floor(rnd()*14)*Math.PI*.5+0.0;return [Math.cos(a)*rr*(k*2-1),h,Math.sin(a)*rr*(k*2-1)];}return [Math.cos(a+(s>0?0:Math.PI))*rr,h,Math.sin(a+(s>0?0:Math.PI))*rr];}),
   mk(function(i,t){var g=Math.ceil(Math.sqrt(NP)),x=(i%g)/g*2-1,z=Math.floor(i/g)/g*2-1;return [x*4.8,Math.sin(x*5.5)*Math.cos(z*5.5)*.75-.6,z*4.8];}),
   mk(function(i,t){var s=i%3===0?1.7:3.2,f=Math.floor(rnd()*6),u=(rnd()*2-1)*s/2,v=(rnd()*2-1)*s/2,h=s/2,e=rnd()<.5?h:-h;var p=[[e,u,v],[u,e,v],[u,v,e]][f%3];return p;}),
   mk(function(i,t){var arm=i%3,r=Math.pow(rnd(),.65)*4.6,a=arm*TAU/3+r*1.25+(rnd()-.5)*.5;return [Math.cos(a)*r,(rnd()-.5)*.45*(1.2-r/5),Math.sin(a)*r];}),
   mk(function(i,t){var r=.5+rnd()*4.2,a=rnd()*TAU;return [Math.cos(a)*r,-1.6+r*.55+(rnd()-.5)*.12,Math.sin(a)*r];}),
   mk(function(i,t){var u=t*TAU*3,pp=2,q=3,r=Math.cos(q*u/pp*0+q*u)+2.2;var x=Math.cos(pp*u)*r,y=Math.sin(pp*u)*r,z=-Math.sin(q*u);var j=.16;return [x*.85+(rnd()-.5)*j,y*.85+(rnd()-.5)*j,z*1.6+(rnd()-.5)*j];})
  ];
  var geo=new T.BufferGeometry(),A=new Float32Array(SH[0]),B=new Float32Array(SH[0]),AR=new Float32Array(NP);
  for(var i=0;i<NP;i++)AR[i]=rnd();
  var pa=new T.BufferAttribute(A,3),pb=new T.BufferAttribute(B,3);pa.setUsage(T.DynamicDrawUsage);pb.setUsage(T.DynamicDrawUsage);
  geo.setAttribute('position',pa);geo.setAttribute('aTo',pb);geo.setAttribute('aR',new T.BufferAttribute(AR,1));
  var U={uMix:{value:1},uTime:{value:0},uSize:{value:small?46:66},uC1:{value:new T.Color('#f5b942')},uC2:{value:new T.Color('#5aa2ff')},uOp:{value:small?.9:1},uPx:{value:dpr},uPulse:{value:0},uPC:{value:new T.Vector2(0,0)}};
  var mat=new T.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
   vertexShader:'attribute vec3 aTo;attribute float aR;uniform float uMix,uTime,uSize,uPx,uPulse;uniform vec2 uPC;uniform vec3 uC1,uC2;varying vec3 vC;varying float vA;void main(){float m=smoothstep(0.,1.,uMix);vec3 p=mix(position,aTo,m);p*=1.+.35*sin(3.14159*m);float pd=length(p.xy-uPC);float pw=exp(-pow(pd-(1.-uPulse)*9.,2.)*.3)*uPulse;p+=normalize(p+vec3(.001))*pw*1.4;p+=.05*vec3(sin(uTime*.7+aR*20.+p.y*2.),cos(uTime*.6+aR*15.+p.x*2.),sin(uTime*.5+aR*10.+p.z));vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=uSize*uPx*(.5+aR*1.2)*(1.+pw*2.5)/-mv.z;vC=mix(uC1,uC2,aR);vA=clamp(1.25+(mv.z+7.5)*.11,.2,1.);}',
   fragmentShader:'precision mediump float;varying vec3 vC;varying float vA;uniform float uOp;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=1.-d*2.;a*=a;gl_FragColor=vec4(vC,a*vA*uOp);}'});
  var pts=new T.Points(geo,mat),grp=new T.Group();grp.add(pts);scene.add(grp);
  /* far star dust, drifts with scroll */
  var DN=small?500:1400,dg=new T.BufferGeometry(),dp=new Float32Array(DN*3);
  for(var di=0;di<DN;di++){var dr=9+rnd()*14,da=rnd()*TAU,dz=(rnd()*2-1)*dr;dp[di*3]=Math.cos(da)*dr*.9;dp[di*3+1]=dz*.7;dp[di*3+2]=Math.sin(da)*dr*.9-6;}
  dg.setAttribute('position',new T.BufferAttribute(dp,3));
  var dust=new T.Points(dg,new T.PointsMaterial({color:0xcfe0ff,size:small?.05:.045,transparent:true,opacity:.7,depthWrite:false,blending:T.AdditiveBlending}));scene.add(dust);
  /* two thin orbit rings around the shape */
  var ringA=new T.Mesh(new T.TorusGeometry(3.7,.012,8,small?90:180),new T.MeshBasicMaterial({color:0xf5b942,transparent:true,opacity:.32,blending:T.AdditiveBlending,depthWrite:false}));
  var ringB=new T.Mesh(new T.TorusGeometry(4.3,.01,8,small?90:180),new T.MeshBasicMaterial({color:0x5aa2ff,transparent:true,opacity:.3,blending:T.AdditiveBlending,depthWrite:false}));
  grp.add(ringA);grp.add(ringB);

  /* ===== universe: planets, stars, comets, black hole. Each section shows a different scene ===== */
  scene.add(new T.AmbientLight(0x8a96c0,.95));var dl=new T.DirectionalLight(0xfff1d6,1.5);dl.position.set(-4,3,5);scene.add(dl);
  var uw=new T.Group();scene.add(uw);
  function cvTex(w,h,fn){var c=d.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new T.CanvasTexture(c);}
  function blobs(x,w,h,cols,n,r0,r1,al){for(var i=0;i<n;i++){x.fillStyle=cols[(rnd()*cols.length)|0];x.globalAlpha=al;x.beginPath();x.ellipse(rnd()*w,rnd()*h,r0+rnd()*r1,(r0+rnd()*r1)*.55,0,0,TAU);x.fill();}x.globalAlpha=1;}
  var TXC={};
  function tex(k){if(TXC[k])return TXC[k];var t;
    if(k==='sun')t=cvTex(256,128,function(x,w,h){x.fillStyle='#ffb02e';x.fillRect(0,0,w,h);blobs(x,w,h,['#ff6a00','#ffd36b','#fff1b0'],70,6,22,.35);});
    else if(k==='earth')t=cvTex(256,128,function(x,w,h){x.fillStyle='#1b5fd1';x.fillRect(0,0,w,h);blobs(x,w,h,['#2f9e57','#3fae5e','#c8b46a'],26,8,26,.95);blobs(x,w,h,['#ffffff'],30,6,22,.35);});
    else if(k==='clouds')t=cvTex(256,128,function(x,w,h){x.clearRect(0,0,w,h);blobs(x,w,h,['#ffffff'],46,6,26,.5);});
    else if(k==='gasA')t=cvTex(256,128,function(x,w,h){for(var y=0;y<h;y+=3){x.fillStyle=(y/3)%2?'#d9a35b':'#b9773a';x.globalAlpha=.55+rnd()*.45;x.fillRect(0,y,w,3+rnd()*3);}x.globalAlpha=1;blobs(x,w,h,['#f3d9a8','#8a4f22'],26,4,18,.18);});
    else if(k==='gasB')t=cvTex(256,128,function(x,w,h){for(var y=0;y<h;y+=3){x.fillStyle=(y/3)%2?'#7fd0e8':'#4aa0d6';x.globalAlpha=.55+rnd()*.45;x.fillRect(0,y,w,3+rnd()*3);}x.globalAlpha=1;blobs(x,w,h,['#ffffff'],20,4,16,.15);});
    else if(k==='mars')t=cvTex(256,128,function(x,w,h){x.fillStyle='#b4452c';x.fillRect(0,0,w,h);blobs(x,w,h,['#7a2a18','#d8714a','#e9a27f'],50,5,18,.4);});
    else if(k==='moon')t=cvTex(128,64,function(x,w,h){x.fillStyle='#b9b9c2';x.fillRect(0,0,w,h);blobs(x,w,h,['#8a8a94','#d4d4dc'],30,3,10,.5);});
    else if(k==='ring')t=cvTex(256,256,function(x,w,h){var cx=w/2;for(var r=cx*.55;r<cx;r+=1.2){x.strokeStyle='rgba('+(200+rnd()*40|0)+','+(170+rnd()*40|0)+','+(120+rnd()*30|0)+','+(.25+rnd()*.6)+')';x.lineWidth=1.4;x.beginPath();x.arc(cx,cx,r,0,TAU);x.stroke();}});
    else if(k==='disc')t=cvTex(256,256,function(x,w,h){var g=x.createRadialGradient(128,128,40,128,128,128);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,190,90,.95)');g.addColorStop(.6,'rgba(255,100,30,.45)');g.addColorStop(1,'rgba(255,60,10,0)');x.fillStyle=g;x.fillRect(0,0,w,h);});
    else if(k==='tail')t=cvTex(128,16,function(x,w,h){var g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(120,180,255,0)');g.addColorStop(1,'rgba(255,255,255,.95)');x.fillStyle=g;x.fillRect(0,h*.3,w,h*.4);});
    else{t=cvTex(128,128,function(x,w,h){var g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba('+k+',1)');g.addColorStop(.28,'rgba('+k+',.4)');g.addColorStop(1,'rgba('+k+',0)');x.fillStyle=g;x.fillRect(0,0,128,128);});}
    TXC[k]=t;return t;}
  function glow(rgb,s){var sp=new T.Sprite(new T.SpriteMaterial({map:tex(rgb),blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:.6}));sp.scale.set(s,s,1);return sp;}
  function ball(r,k,emi){var mm=ball0(r,k,emi);if(emi)mm.material.color.setScalar(.72);return mm;}
  function ball0(r,k,emi){return new T.Mesh(new T.SphereGeometry(r,small?16:30,small?12:22),emi?new T.MeshBasicMaterial({map:tex(k)}):new T.MeshLambertMaterial({map:tex(k)}));}
  function orb(r,op){var p=[];for(var i=0;i<=120;i++){var q=i/120*TAU;p.push(new T.Vector3(Math.cos(q)*r,0,Math.sin(q)*r));}return new T.Line(new T.BufferGeometry().setFromPoints(p),new T.LineBasicMaterial({color:0x8fb4ff,transparent:true,opacity:op||.2}));}
  function pivotWith(r,mesh,sp,ph){var pv=new T.Object3D();mesh.position.x=r;pv.add(mesh);pv.rotation.y=ph||0;pv.userData.sp=sp;return pv;}
  var UN={},UNL=[];
  function reg(name,g,upd){g.visible=false;g.scale.setScalar(.001);g.userData.upd=upd;uw.add(g);UN[name]=g;UNL.push(g);}
  /* solar system */
  (function(){var g=new T.Group(),sun=ball(.8,'sun',true),pv=[];g.add(glow('255,190,80',5.4));g.add(sun);
    [[1.7,.2,'mars',.9],[2.5,.3,'earth',.62],[3.5,.46,'gasA',.4],[4.6,.34,'gasB',.26]].forEach(function(p,i){var m=ball(p[1],p[2]),v=pivotWith(p[0],m,p[3],i*1.7);pv.push(v);g.add(v);g.add(orb(p[0],.22));});
    var NA=small?260:620,ap=new Float32Array(NA*3);for(var i=0;i<NA;i++){var a=rnd()*TAU,r=5.4+rnd()*.7;ap[i*3]=Math.cos(a)*r;ap[i*3+1]=(rnd()-.5)*.14;ap[i*3+2]=Math.sin(a)*r;}
    var ag=new T.BufferGeometry();ag.setAttribute('position',new T.BufferAttribute(ap,3));var belt=new T.Points(ag,new T.PointsMaterial({color:0xcfd6ea,size:.035,transparent:true,opacity:.75,depthWrite:false}));g.add(belt);
    reg('solar',g,function(t,k){sun.rotation.y=t*.12;belt.rotation.y=t*.05*k;pv.forEach(function(v){v.rotation.y+=.004*v.userData.sp*k;v.children[0].rotation.y+=.01;});});})();
  /* ringed planet with moons */
  (function(){var g=new T.Group(),pl=ball(1.15,'gasA'),rg=new T.Mesh(new T.RingGeometry(1.75,3,80),new T.MeshBasicMaterial({map:tex('ring'),side:T.DoubleSide,transparent:true,opacity:.95,depthWrite:false})),m1=pivotWith(3.6,ball(.26,'moon'),.5,0),m2=pivotWith(4.5,ball(.2,'mars'),.33,2.2);
    rg.rotation.x=Math.PI/2;g.add(glow('255,200,120',4.2));g.add(pl);g.add(rg);g.add(m1);g.add(m2);g.add(orb(3.6,.15));g.add(orb(4.5,.12));
    reg('saturn',g,function(t,k){pl.rotation.y=t*.18;m1.rotation.y+=.005*k;m2.rotation.y+=.0034*k;});})();
  /* earth and moon */
  (function(){var g=new T.Group(),e=ball(1.15,'earth'),c=ball(1.18,'clouds'),mo=pivotWith(2.6,ball(.32,'moon'),.55,1);c.material.transparent=true;c.material.depthWrite=false;
    g.add(glow('90,160,255',4.4));g.add(e);g.add(c);g.add(mo);g.add(orb(2.6,.18));
    reg('earth',g,function(t,k){e.rotation.y=t*.12;c.rotation.y=t*.17;mo.rotation.y+=.0045*k;});})();
  /* binary stars */
  (function(){var g=new T.Group(),pv=new T.Object3D(),s1=ball(.7,'sun',true),s2=ball(.5,'sun',true),pl=pivotWith(4,ball(.3,'gasB'),.3,0);
    s1.position.x=-1.1;s2.position.x=1.6;s2.material.color.set(0x9fd0ff);pv.add(s1);pv.add(s2);var g1=glow('255,180,70',4),g2=glow('120,180,255',3.2);g1.position.x=-1.1;g2.position.x=1.6;pv.add(g1);pv.add(g2);
    g.add(pv);g.add(pl);g.add(orb(4,.18));g.add(orb(2.3,.12));
    reg('binary',g,function(t,k){pv.rotation.y+=.012*k;pl.rotation.y+=.004*k;});})();
  /* black hole */
  (function(){var g=new T.Group(),bh=new T.Mesh(new T.SphereGeometry(.85,24,18),new T.MeshBasicMaterial({color:0x000000})),ds=new T.Mesh(new T.RingGeometry(1,3.1,96),new T.MeshBasicMaterial({map:tex('disc'),side:T.DoubleSide,transparent:true,blending:T.AdditiveBlending,depthWrite:false})),h2=new T.Mesh(new T.RingGeometry(.9,1.5,64),new T.MeshBasicMaterial({map:tex('disc'),side:T.DoubleSide,transparent:true,blending:T.AdditiveBlending,depthWrite:false,opacity:.8}));
    ds.rotation.x=Math.PI/2-.35;h2.rotation.x=.2;g.add(glow('255,150,60',6));g.add(ds);g.add(h2);g.add(bh);
    reg('hole',g,function(t,k){ds.rotation.z+=.012*k;h2.rotation.z-=.01*k;});})();
  /* comets */
  var CM=[];
  (function(){var g=new T.Group();for(var i=0;i<7;i++){var c=new T.Group(),tl=new T.Mesh(new T.PlaneGeometry(2.6+rnd()*1.6,.09),new T.MeshBasicMaterial({map:tex('tail'),transparent:true,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide})),hd=glow('200,225,255',.55);tl.position.x=-1.5;c.add(tl);c.add(hd);c.rotation.z=Math.PI*1.12;c.userData={sp:.05+rnd()*.05,ph:rnd()};g.add(c);CM.push(c);}
    reg('comets',g,function(t,k){CM.forEach(function(c,i){c.userData.ph=(c.userData.ph+c.userData.sp*.016*k)%1;var u=c.userData.ph;c.position.set(10-u*22,6-u*10+Math.sin(i)*2.4,-1-(i%3)*.8);});});})();
  var UC={
   top:['solar',-3.9,-1.5,-2.2,.78,.45,.18,1],why:['binary',3.9,1.5,-2.4,.88,.5,-.2,1],about:['saturn',-4,-1.1,-2,.92,.5,.3,1],founder:['earth',3.9,1.4,-2.2,.9,.3,-.15,1],
   story:['hole',0,.2,-5.5,1.5,.15,0,1],courses:['saturn',-4,1.5,-2.4,.88,.6,-.35,1],toppers:['binary',0,3.7,-4,.7,.4,.1,1],press:['comets',0,0,0,1,0,0,1],
   practice:['solar',4.8,-2.6,-3,.72,.3,-.2,1],gallery:['solar',4.4,2.2,-4,1.05,.7,.1,1],enquire:['earth',-4,-1.3,-2,.95,.35,.2,1]
  };
  var curU=null,uBoost=0,lastSy=0;
  function showUni(id){
    var u=UC[id];if(!u)return;var g=UN[u[0]];if(!g)return;var s=u[4]*(small?.55:1),x=small?0:u[1],y=small?(u[2]>0?3.1:-3.1):u[2],z=small?-3:u[3];
    if(curU&&curU!==g){var old=curU;if(W.gsap)gsap.to(old.scale,{x:.001,y:.001,z:.001,duration:.7,ease:'power2.in',overwrite:true,onComplete:function(){if(curU!==old)old.visible=false;}});else old.visible=false;}
    if(curU!==g){g.visible=true;g.scale.setScalar(.001);g.position.set(x,y,z);}
    curU=g;g.rotation.x=u[5];g.rotation.z=u[6];
    if(W.gsap){gsap.to(g.scale,{x:s,y:s,z:s,duration:1.6,ease:'back.out(1.5)',overwrite:true});gsap.to(g.position,{x:x,y:y,z:z,duration:1.4,ease:'power3.inOut',overwrite:true});}else{g.scale.setScalar(s);g.position.set(x,y,z);}
  }

  var cur=-1,mouse={x:0,y:0},tmouse={x:0,y:0},spin=.12;
  function setShape(k){
    if(k===cur)return;cur=k;
    var s=U.uMix.value;s=s*s*(3-2*s);
    for(var i=0;i<A.length;i++)A[i]=A[i]+(B[i]-A[i])*s;
    B.set(SH[k]);pa.needsUpdate=true;pb.needsUpdate=true;
    U.uMix.value=0;if(W.gsap)gsap.to(U.uMix,{value:1,duration:1.6,ease:'power2.inOut',overwrite:true});else U.uMix.value=1;
  }
  var sc=small?.52:1;
  var CF={
   top:[0,2.1,.2,'#f5b942','#5aa2ff',.12],why:[1,-2.9,0,'#2fe08a','#5aa2ff',.1],about:[2,2.9,0,'#5aa2ff','#f5b942',.14],founder:[7,-2.9,0,'#f5b942','#ffffff',.12],
   story:[5,0,0,'#ffffff','#f5b942',.1],courses:[4,2.7,0,'#2fe08a','#f5b942',.12],toppers:[3,0,-.4,'#f5b942','#5aa2ff',.08],practice:[6,-2.7,0,'#5aa2ff','#2fe08a',.12],gallery:[0,0,0,'#ffffff','#f5b942',.1],press:[2,-2.8,0,'#ffffff','#5aa2ff',.12],enquire:[7,2.5,0,'#2fe08a','#f5b942',.14]
  };
  function setScene(id){
    var c=CF[id];if(!c)return;setShape(c[0]);
    var x=small?0:c[1],y=small?(id==='top'?-1.2:.6):c[2],s=id==='gallery'?1.25*sc:sc;
    if(W.gsap){gsap.to(grp.position,{x:x,y:y,duration:1.6,ease:'power3.inOut',overwrite:true});gsap.to(grp.scale,{x:s,y:s,z:s,duration:1.6,ease:'power3.inOut',overwrite:true});
      var c1=new T.Color(c[3]),c2=new T.Color(c[4]);gsap.to(U.uC1.value,{r:c1.r,g:c1.g,b:c1.b,duration:1.4});gsap.to(U.uC2.value,{r:c2.r,g:c2.g,b:c2.b,duration:1.4});}
    else{grp.position.set(x,y,0);grp.scale.setScalar(s);U.uC1.value.set(c[3]);U.uC2.value.set(c[4]);}
    spin=c[5];showUni(id);
  }
  function bind(){
    if(!W.ScrollTrigger){setScene('top');return;}
    var first=null;
    $$('[data-scene]').forEach(function(el){var id=el.dataset.scene;if(!CF[id])return;if(!first)first=id;
      ScrollTrigger.create({trigger:el,start:'top 62%',end:'bottom 62%',onEnter:function(){setScene(id);},onEnterBack:function(){setScene(id);}});});
    Object.keys(CF).forEach(function(id){var el=d.getElementById(id);if(!el||el.dataset.scene)return;
      ScrollTrigger.create({trigger:el,start:'top 62%',end:'bottom 62%',onEnter:function(){setScene(id);},onEnterBack:function(){setScene(id);}});});
    setScene(first||'top');
  }
  function size(){var w=innerWidth,h=innerHeight;rd.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();}
  size();W.addEventListener('resize',function(){small=innerWidth<700;size();});
  if(!coarse)W.addEventListener('mousemove',function(e){tmouse.x=e.clientX/innerWidth-.5;tmouse.y=e.clientY/innerHeight-.5;},{passive:true});
  var last=0,t0=performance.now();
  function frame(now){
    requestAnimationFrame(frame);
    if(d.hidden)return;if(small&&now-last<33)return;last=now;
    var t=(now-t0)/1000;U.uTime.value=t;
    mouse.x+=(tmouse.x-mouse.x)*.05;mouse.y+=(tmouse.y-mouse.y)*.05;
    var sy=W.scrollY/Math.max(1,H.scrollHeight-innerHeight);
    grp.rotation.y=t*spin+mouse.x*.9+sy*2.2;grp.rotation.x=.35+mouse.y*.5+Math.sin(t*.2)*.08;grp.rotation.z=Math.sin(t*.15)*.06;
    var vy=Math.abs(W.scrollY-lastSy);lastSy=W.scrollY;uBoost+=(Math.min(vy*.06,3)-uBoost)*.1;var uk=1+uBoost;
    uw.rotation.y=mouse.x*.55;uw.rotation.x=mouse.y*.3;cam.position.x=mouse.x*.7;cam.position.y=-mouse.y*.5;cam.lookAt(0,0,0);
    UNL.forEach(function(g){if(g.visible&&g.userData.upd)g.userData.upd(t,uk);});
    ringA.rotation.x=t*.35+sy*3;ringA.rotation.y=t*.18;ringB.rotation.x=1.2-t*.25;ringB.rotation.z=t*.3+sy*2;
    dust.rotation.y=t*.012+sy*1.4;dust.rotation.x=sy*.5+mouse.y*.1;
    rd.render(scene,cam);
  }
  d.addEventListener('pointerdown',function(e){
    if(e.target.closest&&e.target.closest('a,button,input,select,textarea,label,[role=button],[data-d],.cc,.fc,.tc,.rka-ov,#dm,#lb,#gw,.ring3d,.cfw,.enq,.sk,.pc3,.sti,nav,.mb'))return;
    U.uPC.value.set((e.clientX/innerWidth-.5)*8,-(e.clientY/innerHeight-.5)*4.5);U.uPulse.value=1;if(W.gsap)gsap.to(U.uPulse,{value:0,duration:1.8,ease:'power2.out',overwrite:true});else U.uPulse.value=0;
  },{passive:true});
  requestAnimationFrame(frame);
  cv.addEventListener('webglcontextlost',function(e){e.preventDefault();});
  bind();
}


function go(){try{initThree();}catch(e){console.error(e);}}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',go);else go();
})();