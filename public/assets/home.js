
(function(){
'use strict';
var d=document,H=d.documentElement,W=window;
var $=function(s,r){return (r||d).querySelector(s);},$$=function(s,r){return [].slice.call((r||d).querySelectorAll(s));};
var mm=W.matchMedia;
var coarse=mm&&mm('(pointer:coarse)').matches;
var small=innerWidth<700;
var weak=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2)||(navigator.deviceMemory&&navigator.deviceMemory<=2);
if(weak)H.classList.add('lite');
var WA='https://wa.me/919693966317?text=';
function clamp(v,a,b){return v<a?a:(v>b?b:v);}

/* ================= split text (hero letters, section words) ================= */
function walk(el,fn){[].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)fn(n);else if(n.nodeType===1&&n.tagName!=='BR')walk(n,fn);});}
var ci=0;
$$('.hero h1').forEach(function(h){walk(h,function(n){var f=d.createDocumentFragment();n.nodeValue.split('').forEach(function(c){if(c===' '){f.appendChild(d.createTextNode(' '));}else{var s=d.createElement('span');s.className='ch';s.textContent=c;f.appendChild(s);}});n.parentNode.replaceChild(f,n);});});
$$('.st').forEach(function(h){h.classList.add('text-balance');walk(h,function(n){var parts=n.nodeValue.split(/(\s+)/),f=d.createDocumentFragment();parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(d.createTextNode(' '));return;}var w=d.createElement('span');w.className='w';var i=d.createElement('i');i.textContent=p;w.appendChild(i);f.appendChild(w);});n.parentNode.replaceChild(f,n);});});
$$('.tag,.hbadge,.abg').forEach(function(e,i){e.classList.add(i%2?'flt2':'flt');e.style.setProperty('--fd',(-i*0.7)+'s');});
$$('.hmini>div').forEach(function(e,i){e.classList.add('flt');e.style.setProperty('--fd',(-i*1.1)+'s');});
$$('.sti').forEach(function(e,i){e.classList.add(i%2?'flt2':'flt');e.style.setProperty('--fd',(-i*.9)+'s');});

/* ================= nav ================= */
var nav=$('#nav'),sp=$('#sp'),tk=false;
function onS(){tk=false;var y=W.scrollY||0;nav.classList.toggle('sc',y>30);var h=H.scrollHeight-innerHeight;sp.style.width=(h>0?y/h*100:0)+'%';}
W.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(onS);}},{passive:true});onS();
var hb=$('#hbg'),nm=$('#nm');
hb.addEventListener('click',function(){hb.classList.toggle('a');nm.classList.toggle('open');});
$$('a',nm).forEach(function(a){a.addEventListener('click',function(){hb.classList.remove('a');nm.classList.remove('open');});});

/* ================= hero coverflow ================= */
var cf=$('#cf'),sl=$$('.cfs',cf),dots=$$('button',$('#cfd')),cur=0,timer=null,N=sl.length;
function place(){
  var w=cf.clientWidth,step=w*(w<560?.29:.3),sw=Math.min(w*.64,430);cf.style.height=Math.round(sw*9/16+34)+'px';
  sl.forEach(function(s,i){
    var o=i-cur;if(o>N/2)o-=N;if(o<-N/2)o+=N;var a=Math.abs(o);
    s.style.transform='translate3d('+(o*step)+'px,'+(a*10)+'px,'+(-a*140)+'px) rotateY('+(-o*34)+'deg) scale('+(a?1:1.04)+')';
    s.style.zIndex=10-a;s.style.opacity=a>2?0:(a===2?.45:(a===1?.8:1));
    s.style.filter=a?'brightness('+(1-a*.2)+')':'none';s.style.pointerEvents=a>2?'none':'auto';
    s.classList.toggle('c',!a);
  });
  dots.forEach(function(b,i){b.classList.toggle('on',i===cur);});
}
function go(i){cur=(i+N)%N;place();}
function auto(){clearInterval(timer);timer=setInterval(function(){go(cur+1);},4200);}
sl.forEach(function(s,i){s.addEventListener('click',function(){if(i!==cur){go(i);auto();}});});
dots.forEach(function(b,i){b.addEventListener('click',function(){go(i);auto();});});
var sx=null;cf.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;clearInterval(timer);},{passive:true});
cf.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>34)go(cur+(dx<0?1:-1));sx=null;auto();},{passive:true});
W.addEventListener('resize',function(){small=innerWidth<700;place();});
if('IntersectionObserver' in W){new IntersectionObserver(function(es){if(es[0].isIntersecting)auto();else clearInterval(timer);}).observe(cf);}
place();

/* ================= enquiry + mobile bar ================= */
$('#enq').addEventListener('submit',function(e){e.preventDefault();
  var n=$('#eq-n').value.trim(),p=$('#eq-p').value.trim(),c=$('#eq-c').value||'not selected';
  W.open(WA+'Hello RK Ranjan Classes, I want a free demo class.%0AStudent: '+encodeURIComponent(n)+'%0AClass: '+encodeURIComponent(c)+'%0APhone: '+encodeURIComponent(p),'_blank','noopener');
});
var ml=$('#mb-l');if(ml)ml.addEventListener('click',function(){if(W.RKAccount&&RKAccount.toggle)RKAccount.toggle();});

/* ================= 3D ring gallery ================= */
var T26="Teachers' Day 2026";
var G=[['td1',T26],['g1',T26+', lamp lighting'],['td2',T26],['g4',T26+', with our students'],['g2',T26+', memento'],['g5',T26+', certificate of volunteer service'],['award','Annual Prize Distribution 2025, Best Institute Award'],['g10',T26+', certificate winners'],['td3',T26+', appreciation certificates'],['g14','Annual Prize Distribution 2025, certificates'],['g8',T26+', group photo'],['td24',"Teachers' Day 2024"],['g15',"Teachers' Day celebration, earlier years"],['certificates','Certificates 2025'],
['g3',T26+', memento'],['g6',T26+', certificate of appreciation'],['g7',T26+', certificate'],['g9',T26+', memento'],['g11',T26+', certificate'],['g12',T26+', certificate'],['g13',T26+', certificate'],['g16',"Teachers' Day celebration, earlier years"],['td4',T26+', with our students'],['td5',T26+', volunteer certificate'],['poster-achievers','Top Achievers poster','p'],['poster-admission','Admission Open poster','p']];
var RN=14,PR=[['press1','Dainik Jagran, 15 December 2025'],['press2','Dainik Bhaskar, 15 December 2025'],['press3','Dainik Bhaskar, Patna edition']];
var LBL=G;
var ring=$('#ring'),rg=$('#rg'),items=[],ry=0,ringVis=false,drag=null,vel=0,R=0,iw=0,ih=0,lastY=W.scrollY;
function build(){
  var w=innerWidth;iw=w<560?210:(w<900?260:320);ih=Math.round(iw*.66);
  var n=RN;R=Math.round((iw/2)/Math.tan(Math.PI/n))+26;
  rg.style.width=iw+'px';rg.style.height=ih+'px';ring.style.height=(ih+70)+'px';
  items.forEach(function(el,i){el.style.width=iw+'px';el.style.height=ih+'px';el.style.transform='rotateY('+(i*360/n)+'deg) translateZ('+R+'px)';});
}
G.slice(0,RN).forEach(function(g,i){
  var el=d.createElement('div');el.className='ri'+(g[2]?' pst':'');el.dataset.i=i;
  el.innerHTML='<img src="image/'+g[0]+'.webp" alt="'+g[1]+'" '+(i<4?'':'loading="lazy" ')+'draggable="false"/><span>'+g[1]+'</span>';
  rg.appendChild(el);items.push(el);
});
build();W.addEventListener('resize',build);
function paint(){
  var n=RN;rg.style.transform='translateZ('+(-R)+'px) rotateY('+ry+'deg)';
  items.forEach(function(el,i){var a=((i*360/n+ry)%360+360)%360;var c=Math.cos(a*Math.PI/180);el.style.opacity=(.4+.6*Math.max(0,(c+.2)/1.2)).toFixed(2);});
}
var raf=0,lastT=0;
function loop(t){
  raf=0;if(!ringVis)return;
  var dt=Math.min(40,t-lastT||16);lastT=t;
  if(!drag){ if(Math.abs(vel)>.02){ry+=vel;vel*=.94;} else ry+=dt*.012; }
  paint();raf=requestAnimationFrame(loop);
}
if('IntersectionObserver' in W){new IntersectionObserver(function(es){ringVis=es[0].isIntersecting;if(ringVis&&!raf){lastT=0;raf=requestAnimationFrame(loop);}}).observe(ring);}else{ringVis=true;raf=requestAnimationFrame(loop);}
ring.addEventListener('pointerdown',function(e){drag={x:e.clientX,ry:ry,t:e.target.closest('.ri'),m:0,lx:e.clientX};vel=0;});
W.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-drag.x;drag.m=Math.max(drag.m,Math.abs(dx));ry=drag.ry+dx*.32;vel=(e.clientX-drag.lx)*.32;drag.lx=e.clientX;});
W.addEventListener('pointerup',function(){if(!drag)return;var t=drag.t,m=drag.m;drag=null;if(m<7&&t)openLb(+t.dataset.i,G);});
W.addEventListener('pointercancel',function(){drag=null;});
W.addEventListener('scroll',function(){var dy=W.scrollY-lastY;lastY=W.scrollY;if(ringVis)ry+=dy*.18;},{passive:true});
paint();

/* ================= lightbox ================= */
var lb=$('#lb'),li=0,lbSx=null;
function showLb(){var g=LBL[li];$('#lbi').src='image/'+g[0]+'.webp';$('#lbi').alt=g[1];$('#lbc').textContent=g[1]+'  ('+(li+1)+' of '+LBL.length+')';}
function openLb(i,list){LBL=list||G;li=i;lb.hidden=false;H.classList.add('nos');showLb();$('.lbx',lb).focus();}
function closeLb(){lb.hidden=true;if(!gw||gw.hidden)H.classList.remove('nos');}
function stepLb(n){li=(li+n+LBL.length)%LBL.length;var im=$('#lbi');im.style.animation='none';void im.offsetWidth;im.style.animation='';showLb();}
$('.lbx',lb).addEventListener('click',closeLb);$('.lbp',lb).addEventListener('click',function(){stepLb(-1);});$('.lbn',lb).addEventListener('click',function(){stepLb(1);});
lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
lb.addEventListener('touchstart',function(e){lbSx=e.touches[0].clientX;},{passive:true});
lb.addEventListener('touchend',function(e){if(lbSx===null)return;var dx=e.changedTouches[0].clientX-lbSx;if(Math.abs(dx)>50)stepLb(dx<0?1:-1);lbSx=null;},{passive:true});

/* all photos grid + press clippings */
var gw=$('#gw'),gwg=$('#gwg');
if(gw){
  gwg.innerHTML=G.map(function(g,i){return '<button type="button" class="gwi" data-i="'+i+'"><img src="image/'+g[0]+'.webp" alt="'+g[1]+'" loading="lazy"/><span>'+g[1]+'</span></button>';}).join('');
  function closeGw(){gw.hidden=true;if(lb.hidden)H.classList.remove('nos');}
  $('#galall').addEventListener('click',function(){gw.hidden=false;H.classList.add('nos');$('.gwc',gw).scrollTop=0;});
  $('.gwx',gw).addEventListener('click',closeGw);$('.gwb',gw).addEventListener('click',closeGw);
  gwg.addEventListener('click',function(e){var b=e.target.closest('.gwi');if(b)openLb(+b.dataset.i,G);});
}
$$('[data-pr]').forEach(function(c){function go(){openLb(+c.dataset.pr,PR);}c.addEventListener('click',go);c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});
/* ================= detail modal ================= */
var dm=$('#dm'),dmt=$('#dmt'),lastF=null;
function wa(t){return WA+encodeURIComponent(t);}
function btns(q){return '<div class="dbt"><a class="btn btn-g" href="#enquire" data-close>Book Free Demo</a><a class="btn btn-o" style="border-color:var(--g);color:var(--g)" href="'+wa(q)+'" target="_blank" rel="noopener">Ask on WhatsApp</a></div>';}
function ul(a){return '<ul>'+a.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>';}
function chips(a){return '<div class="dchips">'+a.map(function(x){return '<span>'+x+'</span>';}).join('')+'</div>';}
var NAME='R.K. Ranjan Sir (Raviranjan Kumar)';
var DET={
 f1:['Why Choose Us','Concept Based Teaching','Every chapter starts with the why, then the how. Students see the idea, solve it step by step and practise it until it sticks.',ul(['Topics explained from the basics','Examples first, formulas after','Doubts cleared in the same class','Revision plan before every exam']),'I want to know more about concept based teaching at RK Ranjan Classes.'],
 f2:['Why Choose Us','Friendly Environment','Open communication. Students feel comfortable asking any question, any time, without fear.',ul(['Small batches, maximum 20 students','Personal attention to every child','Encouraging, not scolding','Parents can speak to the teacher directly']),'I want to know more about the batches at RK Ranjan Classes.'],
 f3:['Why Choose Us','Regular Tests','Chapter wise tests track progress and build exam confidence step by step.',ul(['Chapter wise tests and practice papers','Free online practice tests on this site, Class 6 to 12','Timer, question palette and explanations like a real exam','Student login saves your score, XP and streak']),'I want to know more about the tests at RK Ranjan Classes.'],
 f4:['Why Choose Us','Best Study Material','Updated notes and practice sets matched to CBSE and Bihar Board exam patterns.',ul(['Notes made for CBSE and BSEB syllabus','Practice sets with chapter wise questions','Revision material before exams','Online question bank on this website']),'I want to know about the study material at RK Ranjan Classes.'],
 f5:['Why Choose Us','Proven Results','3800+ students have achieved strong board results. Our track record speaks for itself.',ul(['Best Institute Award 2025','Covered by Dainik Bhaskar and Dainik Jagran','100% board result','Top achievers in Class 10 and Class 12']),'I want to know about the results of RK Ranjan Classes.'],
 f6:['Why Choose Us','Engaging Classes','Interactive, energetic teaching. Classes are enjoyable, memorable and effective.',ul(['Interactive lessons, not just notes','Celebrations and events for students','Practice tests that feel like a game','Quiz games for students are on the way']),'I want to attend a demo class at RK Ranjan Classes.'],
 c1:['Course','Class 6 to 10','A strong foundation in every subject, with board exam focus from the start.',chips(['Maths','Science','English','Hindi','SST'])+ul(['CBSE and Bihar Board both covered','Concept based, no rote learning','Chapter wise tests','Free demo class before you join']),'I want to know about the Class 6 to 10 course.'],
 c2:['Course','Class 11 and 12 Maths','PCM stream. Clear concepts for a high board score and for entrance exam preparation.',chips(['Calculus','Algebra','Vectors','Stats'])+ul(['CBSE and Bihar Board','Concept first, then problem solving','Regular practice and tests','Free demo class before you join']),'I want to know about the Class 11 and 12 Maths course.'],
 c3:['Course','Class 11 and 12 Arts','Humanities stream with complete Intermediate board preparation.',chips(['History','Geography','Pol. Sci','Economics'])+ul(['Intermediate board exam preparation','Notes and answer writing practice','Regular tests','Free demo class before you join']),'I want to know about the Class 11 and 12 Arts course.'],
 c4:['Course','English Literature','Our most loved subject. Grammar, literature and writing for all classes, taught by a director with an MA in English Literature.',chips(['Grammar','Literature','Writing'])+ul(['For all classes','Special focus on writing and understanding','Taught by '+NAME,'Free demo class before you join']),'I want to know about the English Literature course.'],
 dir:['Founder, Director and Author',NAME,'Educator, academic mentor and founder of RK Ranjan Classes.','<div class="dmdir"><img src="image/director.webp" alt="R.K. Ranjan Sir"/><div>'+ul(['MA English Literature','10+ years of teaching','3 research papers published at national institutions','3800+ students mentored','Co-author of the Hindi book Kagzi Aaine'])+'</div></div><div class="dbt"><a class="btn btn-g" href="#enquire" data-close>Book Free Demo</a><a class="btn btn-o" style="border-color:var(--g);color:var(--g)" href="'+wa('Hello Sir, I want to talk about admission.')+'" target="_blank" rel="noopener">WhatsApp Sir</a></div>',null]
};
function openDm(k,custom){
  var x=custom||DET[k];if(!x)return;lastF=d.activeElement;
  dmt.innerHTML='<span class="dtag">'+x[0]+'</span><h3>'+x[1]+'</h3><p>'+x[2]+'</p>'+x[3]+(x[4]?btns(x[4]):'');
  dm.hidden=false;H.classList.add('nos');$('.dmc',dm).scrollTop=0;$('.dmx',dm).focus();
}
function closeDm(){dm.hidden=true;H.classList.remove('nos');if(lastF&&lastF.focus)try{lastF.focus({preventScroll:true});}catch(e){}}
$('.dmx',dm).addEventListener('click',closeDm);$('.dmb',dm).addEventListener('click',closeDm);
dm.addEventListener('click',function(e){if(e.target.closest('[data-close]'))closeDm();});
d.addEventListener('click',function(e){var t=e.target.closest('[data-d]');if(!t||e.target.closest('a[href]'))return;openDm(t.dataset.d);});
d.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(!lb.hidden)closeLb();else if(!dm.hidden)closeDm();else if(gw&&!gw.hidden){gw.hidden=true;H.classList.remove('nos');}}
  else if(!lb.hidden){if(e.key==='ArrowRight')stepLb(1);if(e.key==='ArrowLeft')stepLb(-1);}
  else if((e.key==='Enter'||e.key===' ')&&e.target.dataset&&e.target.dataset.d){e.preventDefault();openDm(e.target.dataset.d);}
});

/* ================= top achievers ================= */
/* TO ADD A STUDENT: add one line below. n = name, p = percent, c = class, b = board, i = photo file name inside image/ (without .webp) */
var TOP=[
 {n:'Shaista Kathat',p:88,c:'10',b:'BSEB',i:'t1'},
 {n:'Swati Singh',p:89,c:'10',b:'CBSE',i:'t2'},
 {n:'Shalini Kumari',p:93,c:'12',b:'CBSE',i:'t3'},
 {n:'Shivam Kumar',p:93,c:'12',b:'CBSE',i:'t4'},
 /* Photos added. Name, class, board and percent are blank until confirmed: fill n, p, c, b for each line. */
 {i:'t6'},{i:'t7'},{i:'t8'},{i:'t9'},{i:'t10'},{i:'t11'},{i:'t12'},{i:'t13'},{i:'t14'},{i:'t15'},{i:'t16'}
];
var tg=$('#tg'),tabs=$('#ttabs'),curF='all';
var classes=[];TOP.forEach(function(s){if(s.c&&classes.indexOf(s.c)<0)classes.push(s.c);});classes.sort(function(a,b){return a-b;});
tabs.innerHTML='<button type="button" data-f="all" class="on">All</button>'+classes.map(function(c){return '<button type="button" data-f="'+c+'">Class '+c+'</button>';}).join('');
function count(el,n){var o={v:0};if(W.gsap){gsap.to(o,{v:n,duration:1.2,ease:'power3.out',onUpdate:function(){el.textContent=Math.round(o.v)+'%';}});}else el.textContent=n+'%';}
function renderTop(){
  var list=TOP.filter(function(s){return curF==='all'||s.c===curF;});
  tg.innerHTML=list.map(function(s){var nm=s.n||'Top Achiever';return '<div class="tc" data-top="'+TOP.indexOf(s)+'" tabindex="0" role="button"><div class="ring" style="--p:'+(s.p||100)+'"><img src="image/'+s.i+'.webp" alt="'+nm+'" loading="lazy" width="104" height="104"/></div><b>'+nm+'</b>'+(s.p?'<div class="pc">0%</div>':'<div class="pc star">&#9733;</div>')+'<small>'+(s.c?'CLASS '+s.c+' &middot; '+s.b:'RK RANJAN CLASSES')+'</small></div>';}).join('')+
  '<a class="tc add" href="#enquire"><div class="plus">+</div>Your name here<span>Join us and be our next topper</span></a>';
  var cards=$$('.tc',tg);
  if(W.gsap)gsap.fromTo(cards,{opacity:0,y:40,rotationX:20},{opacity:1,y:0,rotationX:0,duration:.8,stagger:.09,ease:'power3.out',clearProps:'transform'});
  cards.forEach(function(c,k){var p=c.querySelector('.pc');if(p&&list[k]&&list[k].p)count(p,list[k].p);});
  if(W.VanillaTilt&&!coarse)VanillaTilt.init(cards.filter(function(c){return !c.classList.contains('add');}),{max:12,speed:500,glare:true,'max-glare':.22,perspective:900});
}
tabs.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;curF=b.dataset.f;$$('button',tabs).forEach(function(x){x.classList.toggle('on',x===b);});renderTop();});
tg.addEventListener('click',function(e){var t=e.target.closest('[data-top]');if(!t)return;var s=TOP[+t.dataset.top];
  var nm=s.n||'our top achievers';openDm('x',['Top Achiever',s.c?('Class '+s.c+' &middot; '+(s.b==='BSEB'?'Bihar Board':'CBSE')):'RK Ranjan Classes','Hard work, guided in the right direction. Congratulations from everyone at RK Ranjan Classes.','<div class="dbig"><img src="image/'+s.i+'.webp" alt="'+nm+'"/><div><b>'+(s.p?s.p+'%':'&#9733;')+'</b><div style="font-weight:800;font-size:18px">'+(s.n||'Top Achiever')+'</div></div></div>',"I want to join RK Ranjan Classes like "+nm+"."]);});
var topDone=false;
function startTop(){if(topDone)return;topDone=true;renderTop();}

/* ================= icons ================= */
function icons(){if(W.lucide&&lucide.createIcons)try{lucide.createIcons();}catch(e){}}

/* ================= GSAP: intro, reveals, story, counters ================= */
function initGsap(){
  if(!W.gsap)return startTop();
  if(W.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
  var hasST=!!W.ScrollTrigger;
  /* hero intro */
  var tl=gsap.timeline({defaults:{ease:'power4.out'}});
  tl.from('.hero h1 .ch',{opacity:0,yPercent:70,rotationX:-85,transformOrigin:'50% 100%',duration:1.1,stagger:.04},.15)
    .from('.hbadge',{opacity:0,y:24,duration:.8},.05)
    .from('.hero .lead',{opacity:0,y:30,duration:.9},.8)
    .from('.hero .hbtns',{opacity:0,y:30,duration:.9},.95)
    .from('.hero .hmini',{opacity:0,y:30,duration:.9},1.1)
    .from('.cfw',{opacity:0,x:90,rotationY:-30,scale:.9,duration:1.4,clearProps:'transform,opacity'},.4);
  if(!hasST){startTop();return;}
  /* reveals */
  var groups=[['.rv',{y:56,rotationX:22,z:-60,filter:'blur(7px)',transformOrigin:'50% 100%'}],['.rvl',{x:-70,rotationY:14}],['.rvr',{x:70,rotationY:-14}],['.rvs',{scale:.85,y:30}]];
  groups.forEach(function(g){
    var els=$$(g[0]).filter(function(e){return !e.classList.contains('st')&&!e.closest('#tg');});
    if(!els.length)return;
    gsap.set(els,Object.assign({opacity:0},g[1]));
    ScrollTrigger.batch(els,{start:'top 92%',once:true,onEnter:function(b){gsap.to(b,{opacity:1,x:0,y:0,z:0,rotationX:0,rotationY:0,scale:1,filter:'blur(0px)',duration:1.2,ease:'power3.out',stagger:.12,clearProps:'transform,filter'});}});
  });
  /* section titles word by word */
  $$('.st').forEach(function(h){
    var ws=$$('.w>i',h);if(!ws.length)return;
    gsap.set(ws,{opacity:0,yPercent:70,rotationX:-100,z:-140,transformOrigin:'50% 100%'});
    ScrollTrigger.create({trigger:h,start:'top 90%',once:true,onEnter:function(){gsap.to(ws,{opacity:1,yPercent:0,rotationX:0,z:0,duration:1.25,ease:'back.out(1.5)',stagger:.09,onComplete:function(){h.classList.add('glow');}});}});
  });
  /* hero text follows the mouse in 3D */
  if(!coarse&&gsap.quickTo){var hl=$('.hero .hl');if(hl){gsap.set(hl,{transformPerspective:900});var qx=gsap.quickTo(hl,'rotationY',{duration:.9,ease:'power3.out'}),qy=gsap.quickTo(hl,'rotationX',{duration:.9,ease:'power3.out'});
    W.addEventListener('mousemove',function(e){qx((e.clientX/innerWidth-.5)*9);qy(-(e.clientY/innerHeight-.5)*6);},{passive:true});}}
  /* huge floating outline words behind sections + nav scroll spy */
  var BW={why:'WHY US',about:'ABOUT',founder:'AUTHOR',courses:'LEARN',toppers:'TOPPERS',press:'PRESS',practice:'PRACTICE',gallery:'MOMENTS',enquire:'JOIN US'};
  Object.keys(BW).forEach(function(id){var s=d.getElementById(id);if(!s)return;var b=d.createElement('div');b.className='bgw';b.setAttribute('aria-hidden','true');b.textContent=BW[id];s.insertBefore(b,s.firstChild);
    gsap.fromTo(b,{xPercent:14,rotationX:18},{xPercent:-14,rotationX:-10,ease:'none',scrollTrigger:{trigger:s,start:'top bottom',end:'bottom top',scrub:true}});});
  ['top','about','founder','courses','toppers','press','practice','gallery','enquire'].forEach(function(id){var el=d.getElementById(id);if(!el)return;
    function on(){$$('.nm a[data-sp]').forEach(function(x){x.classList.toggle('on',x.dataset.sp===id);});}
    ScrollTrigger.create({trigger:el,start:'top 55%',end:'bottom 55%',onEnter:on,onEnterBack:on});});
  /* counters */
  $$('[data-c]').forEach(function(el){var n=+el.dataset.c,s=el.dataset.s||'',o={v:0};
    ScrollTrigger.create({trigger:el,start:'top 92%',once:true,onEnter:function(){gsap.to(o,{v:n,duration:1.8,ease:'power3.out',onUpdate:function(){el.textContent=Math.round(o.v)+s;}});}});});
  /* parallax photos */
  var fi=$('.aph .fr img');if(fi){gsap.set(fi,{scale:1.18});gsap.fromTo(fi,{yPercent:-7},{yPercent:7,ease:'none',scrollTrigger:{trigger:'.aph',start:'top bottom',end:'bottom top',scrub:true}});}
  var fc=$('.fcard');if(fc)gsap.fromTo('.fglow',{rotation:0},{rotation:180,ease:'none',scrollTrigger:{trigger:'#founder',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.to('.hero .hl',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.cfw',{yPercent:8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  /* top achievers start when visible */
  ScrollTrigger.create({trigger:tg,start:'top 88%',once:true,onEnter:startTop});
  /* story: pinned, scrubbed 3D cards */
  var story=$('#story'),sk=$$('.sk',story),sd=$$('#sdots button'),bar=$('#sbar'),NN=sk.length;
  function setStory(p){
    var pos=p*(NN-1),cw=sk[0].offsetWidth,k=small?.64:.7;
    sk.forEach(function(c,i){var o=i-pos,a=Math.abs(o);
      c.style.transform='translate3d('+(o*cw*k)+'px,'+(a*14)+'px,'+(-a*230)+'px) rotateY('+(-o*34)+'deg) scale('+(1-Math.min(a,2)*.06)+')';
      c.style.opacity=clamp(1.15-a*.62,0,1);c.style.zIndex=20-Math.round(a*5);c.style.pointerEvents=a<.5?'auto':'none';});
    var act=Math.round(pos);sd.forEach(function(b,i){b.classList.toggle('on',i===act);});
    bar.style.width=(p*100)+'%';story.style.setProperty('--sp',p.toFixed(3));
  }
  var stT=ScrollTrigger.create({trigger:story,start:'top top',end:'+=320%',pin:'.stky',scrub:.6,anticipatePin:1,onUpdate:function(s){setStory(s.progress);}});
  setStory(0);
  function goStep(i){i=Math.max(0,Math.min(NN-1,i));var y=stT.start+(i/(NN-1))*(stT.end-stT.start)+2;W.scrollTo({top:y,behavior:'smooth'});}
  function curStep(){return Math.round(stT.progress*(NN-1));}
  var sp=$('#sprev'),sn=$('#snext');if(sp)sp.addEventListener('click',function(){goStep(curStep()-1);});if(sn)sn.addEventListener('click',function(){goStep(curStep()+1);});
  var scn=$('#scene'),sx=null,sy=0;
  scn.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY;},{passive:true});
  scn.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)goStep(curStep()+(dx<0?1:-1));},{passive:true});
  var mx=null;scn.addEventListener('mousedown',function(e){mx=e.clientX;});W.addEventListener('mouseup',function(e){if(mx===null)return;var dx=e.clientX-mx;mx=null;if(Math.abs(dx)>60)goStep(curStep()+(dx<0?1:-1));});
  sd.forEach(function(b,i){b.addEventListener('click',function(){var y=stT.start+(i/(NN-1))*(stT.end-stT.start)+2;W.scrollTo({top:y,behavior:'smooth'});});});
  W.addEventListener('load',function(){ScrollTrigger.refresh();});
}

/* ================= Vanilla-Tilt ================= */
function initTilt(){
  if(!W.VanillaTilt||coarse)return;
  var all=$$('.fc,.cc,.sti,.fcard,.enq');all.forEach(function(el){if(el.vanillaTilt)el.vanillaTilt.destroy();});
  VanillaTilt.init($$('.fc,.cc,.sti'),{max:10,speed:500,glare:true,'max-glare':.22,perspective:1000,scale:1.02});
  VanillaTilt.init($$('.fcard'),{max:12,speed:600,glare:true,'max-glare':.3,perspective:1000});
  VanillaTilt.init($$('.rka-card'),{max:5,speed:500,glare:true,'max-glare':.1,perspective:1000});
  VanillaTilt.init($$('.enq'),{max:4,speed:600,glare:true,'max-glare':.12});
}

/* ================= boot ================= */
function boot(){
  icons();
  try{initGsap();}catch(e){startTop();console.error(e);}
  try{initTilt();}catch(e){}
  }
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot);else boot();
})();

