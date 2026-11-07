(function(){'use strict';
var d=document,H=d.documentElement,W=window;
var $=function(s,r){return (r||d).querySelector(s);},$$=function(s,r){return [].slice.call((r||d).querySelectorAll(s));};
var coarse=W.matchMedia&&W.matchMedia('(pointer:coarse)').matches;
function walk(el,fn){[].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)fn(n);else if(n.nodeType===1&&n.tagName!=='BR')walk(n,fn);});}
/* split titles into words */
$$('.st').forEach(function(h){h.classList.add('text-balance');walk(h,function(n){var parts=n.nodeValue.split(/(\s+)/),f=d.createDocumentFragment();parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){f.appendChild(d.createTextNode(' '));return;}var w=d.createElement('span');w.className='w';var i=d.createElement('i');i.textContent=p;w.appendChild(i);f.appendChild(w);});n.parentNode.replaceChild(f,n);});});
$$('.tag,.abg').forEach(function(e,i){e.classList.add(i%2?'flt2':'flt');e.style.setProperty('--fd',(-i*0.7)+'s');});
/* nav */
var nav=$('#nav'),sp=$('#sp'),tk=false;
function onS(){tk=false;var y=W.scrollY||0;nav.classList.toggle('sc',y>30);var h=H.scrollHeight-innerHeight;if(sp)sp.style.width=(h>0?y/h*100:0)+'%';}
W.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(onS);}},{passive:true});onS();
var hb=$('#hbg'),nm=$('#nm');
if(hb)hb.addEventListener('click',function(){hb.classList.toggle('a');nm.classList.toggle('open');});
d.addEventListener('click',function(e){if(nm&&nm.classList.contains('open')&&!e.target.closest('#nav')){nm.classList.remove('open');hb.classList.remove('a');}});
var ml=$('#mb-l');if(ml)ml.addEventListener('click',function(){if(W.RKAccount&&RKAccount.toggle)RKAccount.toggle();else location.href='login.html';});
/* nav: scroll the active link into view on small screens */
var on=$('.nm a.on');if(on&&nm&&innerWidth>900){/* desktop nav fits */}
function icons(){if(W.lucide&&lucide.createIcons)try{lucide.createIcons();}catch(e){}}
function gs(){
  if(!W.gsap||!W.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  /* hero intro */
  var tl=gsap.timeline({defaults:{ease:'power4.out'}});
  tl.from('.ph .crumb',{opacity:0,y:-14,duration:.7},.05)
    .from('.ph .tag',{opacity:0,y:20,duration:.8},.15)
    .from('.ph h1 .w>i',{opacity:0,yPercent:80,rotationX:-90,z:-120,transformOrigin:'50% 100%',duration:1.1,stagger:.1,ease:'back.out(1.4)'},.25)
    .from('.ph .lead',{opacity:0,y:26,duration:.9},.7)
    .from('.ph .hbtns',{opacity:0,y:26,duration:.9},.85)
    .from('.ph .phv',{opacity:0,x:80,rotationY:-28,scale:.9,duration:1.3,clearProps:'transform,opacity'},.35);
  /* reveals */
  [['.rv',{y:56,rotationX:22,z:-60,filter:'blur(7px)',transformOrigin:'50% 100%'}],['.rvl',{x:-70,rotationY:14}],['.rvr',{x:70,rotationY:-14}],['.rvs',{scale:.85,y:30}]].forEach(function(g){
    var els=$$(g[0]).filter(function(e){return !e.classList.contains('st')&&!e.closest('.ph');});
    if(!els.length)return;
    gsap.set(els,Object.assign({opacity:0},g[1]));
    ScrollTrigger.batch(els,{start:'top 94%',once:true,onEnter:function(b){gsap.to(b,{opacity:1,x:0,y:0,z:0,rotationX:0,rotationY:0,scale:1,filter:'blur(0px)',duration:1.1,ease:'power3.out',stagger:.1,clearProps:'transform,filter'});}});
  });
  /* section titles word by word */
  $$('.st').forEach(function(h){
    if(h.closest('.ph'))return;
    var ws=$$('.w>i',h);if(!ws.length)return;
    gsap.set(ws,{opacity:0,yPercent:70,rotationX:-100,z:-140,transformOrigin:'50% 100%'});
    ScrollTrigger.create({trigger:h,start:'top 92%',once:true,onEnter:function(){gsap.to(ws,{opacity:1,yPercent:0,rotationX:0,z:0,duration:1.2,ease:'back.out(1.5)',stagger:.09,onComplete:function(){h.classList.add('glow');}});}});
  });
  /* big outline words */
  $$('[data-bgw]').forEach(function(s){var b=d.createElement('div');b.className='bgw';b.setAttribute('aria-hidden','true');b.textContent=s.dataset.bgw;s.insertBefore(b,s.firstChild);
    gsap.fromTo(b,{xPercent:14,rotationX:18},{xPercent:-14,rotationX:-10,ease:'none',scrollTrigger:{trigger:s,start:'top bottom',end:'bottom top',scrub:true}});});
  /* counters */
  $$('[data-c]').forEach(function(el){var n=parseFloat(el.dataset.c),s=el.dataset.s||'',dec=el.dataset.dec|0,o={v:0};
    ScrollTrigger.create({trigger:el,start:'top 95%',once:true,onEnter:function(){gsap.to(o,{v:n,duration:1.8,ease:'power3.out',onUpdate:function(){el.textContent=(dec?o.v.toFixed(dec):Math.round(o.v))+s;}});}});});
  /* bars */
  $$('[data-w]').forEach(function(el){gsap.set(el,{width:0});ScrollTrigger.create({trigger:el,start:'top 95%',once:true,onEnter:function(){gsap.to(el,{width:el.dataset.w+'%',duration:1.4,ease:'power3.out'});}});});
  /* parallax */
  $$('.plx').forEach(function(im){gsap.set(im,{scale:1.16});gsap.fromTo(im,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:im.parentNode,start:'top bottom',end:'bottom top',scrub:true}});});
  /* hero text follows mouse */
  if(!coarse&&gsap.quickTo){var hl=$('.ph .phl');if(hl){gsap.set(hl,{transformPerspective:900});var qx=gsap.quickTo(hl,'rotationY',{duration:.9,ease:'power3.out'}),qy=gsap.quickTo(hl,'rotationX',{duration:.9,ease:'power3.out'});
    W.addEventListener('mousemove',function(e){qx((e.clientX/innerWidth-.5)*8);qy(-(e.clientY/innerHeight-.5)*5);},{passive:true});}}
  W.addEventListener('load',function(){ScrollTrigger.refresh();});
}
function tilt(){
  if(!W.VanillaTilt||coarse)return;
  VanillaTilt.init($$('.gc,.sti,.fc,.cc,.rvc,.pcard'),{max:9,speed:500,glare:true,'max-glare':.2,perspective:1000,scale:1.02});
  VanillaTilt.init($$('.phv .fcard,.fcard'),{max:12,speed:600,glare:true,'max-glare':.3,perspective:1000});
}
function boot(){icons();try{gs();}catch(e){console.error(e);}try{tilt();}catch(e){}}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot);else boot();
W.RKP={icons:icons,$:$,$$:$$};
})();
