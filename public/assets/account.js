
/* ===== RK RANJAN CLASSES : STUDENT ACCOUNT (Firebase) =====
   Needs firebase-config.js (see SETUP.txt). Without it the site still works, only login is switched off.
   Data model:
     loginmap/{id}        { email }                         public lookup so a student can log in with an ID
     students/{id}        { name, cls, uid, xp, streak, ... } private to the student and the admin
     students/{id}/results/{auto}                           one document per finished test
     board/{id}           { name, cls, xp, tests, streak }  class leaderboard, visible to logged in students   */
(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return [].slice.call((r||document).querySelectorAll(s));};
var CFG=window.RK_FIREBASE_CONFIG||{};
var READY=!!(CFG.apiKey&&CFG.projectId&&String(CFG.apiKey).indexOf('PASTE')<0);
var DOM='students.rkranjanclasses.in';
var SDK='https://www.gstatic.com/firebasejs/10.12.2/';
var fbP=null,me=null,pending=null,inflight=null,authReady=null;
var ICON='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>';

function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function p2(n){return n<10?'0'+n:''+n;}
function dkey(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());}
function today(){return dkey(new Date());}
function yday(){var d=new Date();d.setDate(d.getDate()-1);return dkey(d);}
function norm(id){return String(id||'').toLowerCase().replace(/[^a-z0-9_]/g,'');}
function first(n){return String(n||'').split(' ')[0];}
function lvl(xp){return Math.floor(Math.sqrt((xp||0)/60))+1;}
function lvlBase(l){return 60*(l-1)*(l-1);}
function lsGet(k){try{var v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}}
function lsSet(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function isStudentMail(m){return !!m&&m.slice(-(DOM.length+1))==='@'+DOM;}
function idFromMail(m){var l=m.split('@')[0];return l.slice(0,l.lastIndexOf('.v'));}

var BADGES=[
  {id:'first',name:'First Step',desc:'Finish your first test',ok:function(p){return p.tests>=1;}},
  {id:'t5',name:'Practice Habit',desc:'Finish 5 tests',ok:function(p){return p.tests>=5;}},
  {id:'t25',name:'Marathon',desc:'Finish 25 tests',ok:function(p){return p.tests>=25;}},
  {id:'perfect',name:'Perfect Score',desc:'Get every answer right',ok:function(p,r){return !!r&&r.n>0&&r.correct===r.n;}},
  {id:'speed',name:'Speedster',desc:'75% or more in half the time',ok:function(p,r){return !!r&&r.pct>=75&&r.secs<=r.mins*30;}},
  {id:'s3',name:'3 Day Streak',desc:'Practice 3 days in a row',ok:function(p){return p.streak>=3;}},
  {id:'s7',name:'7 Day Streak',desc:'Practice 7 days in a row',ok:function(p){return p.streak>=7;}}
];

/* ---------- Firebase loader (only when needed) ---------- */
function load(){
  if(fbP)return fbP;
  fbP=Promise.all([import(SDK+'firebase-app.js'),import(SDK+'firebase-auth.js'),import(SDK+'firebase-firestore.js')]).then(function(m){
    var app=m[0].initializeApp(CFG);
    return {A:m[1],F:m[2],auth:m[1].getAuth(app),db:m[2].getFirestore(app)};
  });
  fbP.catch(function(){fbP=null;});
  return fbP;
}
function boot(){
  if(!READY){authReady=Promise.resolve();return;}
  authReady=load().then(function(fb){
    return new Promise(function(res){
      var first=true;
      fb.A.onAuthStateChanged(fb.auth,function(u){onAuth(u).then(function(){if(first){first=false;res();}});});
    });
  }).catch(function(){});
}

/* ---------- auth state ---------- */
function onAuth(user){
  var uid=user?user.uid:'none';
  if(inflight&&inflight.uid===uid)return inflight.p;
  var p=doAuth(user);inflight={uid:uid,p:p};
  p.then(function(){if(inflight&&inflight.p===p)inflight=null;},function(){if(inflight&&inflight.p===p)inflight=null;});
  return p;
}
function doAuth(user){
  return load().then(function(fb){
    if(!user||!isStudentMail(user.email)){me=null;if(!user)lsSet('rka_hint',null);refreshUI();return;}
    var id=idFromMail(user.email);
    return fb.F.getDoc(fb.F.doc(fb.db,'students',id)).then(function(snap){
      var d=snap.exists()?snap.data():null;
      if(!d||d.active===false||d.uid!==user.uid){
        var closed=d&&d.active===false;
        return fb.A.signOut(fb.auth).then(function(){me=null;lsSet('rka_hint',null);refreshUI();if(closed)toast('This account is closed. Please contact the institute.');});
      }
      d.id=id;me=d;lsSet('rka_hint',{id:id,name:d.name});refreshUI();
      if(pending){var pr=pending;pending=null;saveResult(pr).then(function(i){if(window.RKAccount&&RKAccount.onSaved)RKAccount.onSaved(i);});}
      var b=$('.rkp-cls[data-c="'+d.cls+'"]');if(b&&!$('.rkp-cls.on'))b.click();
    });
  }).catch(function(){refreshUI();});
}

function login(idRaw,pass){
  var id=norm(idRaw);
  if(!id||!pass)return Promise.reject({msg:'Enter your ID and password. ID और password भरें।'});
  return load().then(function(fb){
    return fb.F.getDoc(fb.F.doc(fb.db,'loginmap',id)).then(function(m){
      if(!m.exists())throw {msg:'This ID was not found. Check it or contact the institute. यह ID नहीं मिली।'};
      return fb.A.signInWithEmailAndPassword(fb.auth,m.data().email,pass).catch(function(e){
        if(e&&e.code==='auth/too-many-requests')throw {msg:'Too many attempts. Please wait a few minutes. कुछ देर बाद फिर कोशिश करें।'};
        if(e&&e.code==='auth/network-request-failed')throw {msg:'No internet. Please check your connection.'};
        throw {msg:'Wrong ID or password. ID या password गलत है।'};
      });
    }).then(function(){return onAuth(fb.auth.currentUser);});
  },function(){throw {msg:'Could not connect. Please check your internet.'};});
}
function logout(){
  return load().then(function(fb){return fb.A.signOut(fb.auth);}).then(function(){
    me=null;lsSet('rka_hint',null);closeDash();refreshUI();toast('You have been logged out.');
  });
}

/* ---------- saving a test result ---------- */
function saveResult(r){
  if(!READY)return Promise.resolve({status:'off'});
  if(!me){pending=r;return Promise.resolve({status:'guest'});}
  return load().then(function(fb){
    var F=fb.F,db=fb.db,id=me.id;
    return F.getDoc(F.doc(db,'students',id)).then(function(snap){
      var p=snap.data();
      var gain=r.correct*10+20+(r.n>0&&r.correct===r.n?50:0);
      var t=today(),streak=p.streak||0;
      if(p.lastDay!==t){streak=(p.lastDay===yday())?streak+1:1;}
      if(streak<1)streak=1;
      var np={xp:(p.xp||0)+gain,streak:streak,lastDay:t,tests:(p.tests||0)+1,correct:(p.correct||0)+r.correct,attempted:(p.attempted||0)+r.correct+r.wrong,best:Math.max(p.best||0,r.pct),updatedAt:Date.now()};
      var have=p.badges||[],nb=[];
      BADGES.forEach(function(b){if(have.indexOf(b.id)<0&&b.ok(np,r))nb.push(b);});
      np.badges=have.concat(nb.map(function(b){return b.id;}));
      return F.addDoc(F.collection(db,'students',id,'results'),r).then(function(){
        return F.updateDoc(F.doc(db,'students',id),np);
      }).then(function(){
        return F.updateDoc(F.doc(db,'board',id),{xp:np.xp,tests:np.tests,streak:np.streak,updatedAt:np.updatedAt});
      }).then(function(){
        for(var k in np)me[k]=np[k];
        refreshUI();
        return {status:'saved',gain:gain,xp:np.xp,level:lvl(np.xp),streak:streak,newBadges:nb};
      });
    });
  }).catch(function(e){if(window.console)console.warn('RK save failed',e);return {status:'error'};});
}

/* ---------- navbar chip, strip, menu ---------- */
function hint(){return me||lsGet('rka_hint');}
function refreshUI(){
  var u=hint(),b=$('#rka-btn'),m=$('#rka-mbtn');
  if(b){
    if(u&&u.name){b.innerHTML='<span class="rka-av">'+esc(u.name.charAt(0).toUpperCase())+'</span><span class="rka-nm">'+esc(first(u.name))+'</span>';b.classList.add('in');b.setAttribute('aria-label','Open my dashboard');}
    else{b.innerHTML=ICON+'<span class="rka-nm">Student Login</span>';b.classList.remove('in');b.setAttribute('aria-label','Student login');}
  }
  if(m)m.textContent=u&&u.name?'My Dashboard ('+first(u.name)+')':'Student Login';
  var s=$('#rka-strip');
  if(s){
    if(!READY){s.hidden=true;}
    else{
      s.hidden=false;
      if(u&&u.name)s.innerHTML='<div><b>Welcome back, '+esc(first(u.name))+'</b><span>Your scores are saved automatically.</span></div><button type="button" class="rka-sb" data-a="dash">My Dashboard</button>';
      else s.innerHTML='<div><b>Login to save your scores</b><span>Keep your marks, XP, streak and class rank in one place.</span></div><button type="button" class="rka-sb" data-a="login">Student Login</button>';
    }
  }
}
function navClick(){
  if(hint())openDashboard();else openLogin();
}
function mount(){
  var nr=$('.nr'),cta=$('.cta-nav');
  if(nr&&!$('#rka-btn')){
    var b=document.createElement('button');b.type='button';b.id='rka-btn';b.className='rka-nbtn';
    nr.insertBefore(b,cta||nr.firstChild);b.addEventListener('click',navClick);
  }
  var nm=$('#nm');
  if(nm&&!$('#rka-mbtn')){
    var a=document.createElement('a');a.href='#';a.id='rka-mbtn';a.className='rka-m';
    a.addEventListener('click',function(e){e.preventDefault();$('#nm').classList.remove('open');$('#hbg').classList.remove('a');navClick();});
    nm.insertBefore(a,nm.firstChild.nextSibling);
  }
  var card=$('.rkp-card');
  if(card&&!$('#rka-strip')){
    var s=document.createElement('div');s.id='rka-strip';s.className='rka-strip';
    s.addEventListener('click',function(e){var x=e.target.closest('[data-a]');if(!x)return;if(x.dataset.a==='dash')openDashboard();else openLogin();});
    card.parentNode.insertBefore(s,card);
  }
  refreshUI();
}

/* ---------- toast ---------- */
function toast(msg){
  var t=document.createElement('div');t.className='rka-toast';t.textContent=msg;document.body.appendChild(t);
  setTimeout(function(){t.remove();},3200);
}

/* ---------- login modal ---------- */
function lock(on){document.documentElement.style.overflow=on?'hidden':'';}
function openLogin(){
  var o=$('#rka-lg');if(!o)return;
  $('#rka-err').hidden=true;$('#rka-pw').value='';
  $('#rka-form').hidden=!READY;$('#rka-off').hidden=READY;
  o.hidden=false;lock(true);
  if(READY)setTimeout(function(){$('#rka-id').focus();},120);
}
function closeLogin(){$('#rka-lg').hidden=true;if($('#rka-db').hidden)lock(false);}
function bindLogin(){
  $('#rka-lx').addEventListener('click',closeLogin);
  $('#rka-lg').addEventListener('click',function(e){if(e.target===this)closeLogin();});
  $('#rka-eye').addEventListener('click',function(){var i=$('#rka-pw'),s=i.type==='password';i.type=s?'text':'password';this.textContent=s?'Hide':'Show';});
  $('#rka-form').addEventListener('submit',function(e){
    e.preventDefault();
    var btn=$('#rka-sub'),er=$('#rka-err');er.hidden=true;btn.disabled=true;btn.textContent='Please wait...';
    login($('#rka-id').value,$('#rka-pw').value).then(function(){
      btn.disabled=false;btn.textContent='Login';
      if(me){closeLogin();toast('Welcome, '+first(me.name)+'!');var nbtn=$('#rka-btn');if(nbtn){nbtn.classList.remove('pulse');void nbtn.offsetWidth;nbtn.classList.add('pulse');}}
      else{er.textContent='Could not open your profile. Please contact the institute.';er.hidden=false;}
    },function(e2){
      btn.disabled=false;btn.textContent='Login';
      er.textContent=(e2&&e2.msg)||'Something went wrong. Please try again.';er.hidden=false;
      var c=$('.rka-card',$('#rka-lg'));c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');
    });
  });
}

/* ---------- dashboard ---------- */
function closeDash(){var d=$('#rka-db');if(d)d.hidden=true;if($('#rka-lg').hidden)lock(false);}
function openDashboard(){
  var d=$('#rka-db');if(!d)return;
  d.hidden=false;lock(true);
  $('#rka-dbody').innerHTML='<div class="rka-load"><i></i><span>Loading your dashboard...</span></div>';
  (authReady||Promise.resolve()).then(function(){
    if(!me){closeDash();openLogin();return;}
    var id=me.id,cls=me.cls;
    return load().then(function(fb){
      var F=fb.F,db=fb.db;
      return Promise.all([
        F.getDocs(F.query(F.collection(db,'students',id,'results'),F.orderBy('t','desc'),F.limit(30))),
        F.getDocs(F.query(F.collection(db,'board'),F.where('cls','==',cls),F.limit(200))),
        F.getDoc(F.doc(db,'students',id))
      ]);
    }).then(function(x){
      var fresh=x[2].data();if(fresh){fresh.id=id;me=fresh;}
      var res=[];x[0].forEach(function(s){res.push(s.data());});
      var bd=[];x[1].forEach(function(s){var v=s.data();v.id=s.id;bd.push(v);});
      renderDash(res,bd);
    });
  }).catch(function(){
    $('#rka-dbody').innerHTML='<div class="rka-load"><span>Could not load your data. Please check your internet and try again.</span></div>';
  });
}
function renderDash(res,bd){
  var p=me,xp=p.xp||0,l=lvl(xp),a=lvlBase(l),b=lvlBase(l+1),pc=Math.min(100,Math.round((xp-a)/(b-a)*100));
  var acc=p.attempted?Math.round((p.correct||0)/p.attempted*100):0;
  bd.sort(function(u,v){return (v.xp||0)-(u.xp||0);});
  var rank=0;bd.forEach(function(u,i){if(u.id===p.id)rank=i+1;});
  $('#rka-dname').textContent=p.name;
  $('#rka-dsub').textContent='Class '+p.cls+'  |  ID '+p.id;
  var h='';
  h+='<div class="rka-hero"><div class="rka-lv"><small>LEVEL</small><b>'+l+'</b></div><div class="rka-xp"><div class="rka-xt"><b>'+xp+' XP</b><span>'+(b-xp)+' XP to Level '+(l+1)+'</span></div><div class="rka-xb"><i style="width:0" data-w="'+pc+'"></i></div></div></div>';
  h+='<div class="rka-stats">'+
     '<div class="rka-st" style="--d:1"><b>'+(p.streak||0)+'</b><small>Day streak</small></div>'+
     '<div class="rka-st" style="--d:2"><b>'+(p.tests||0)+'</b><small>Tests done</small></div>'+
     '<div class="rka-st" style="--d:3"><b>'+acc+'%</b><small>Accuracy</small></div>'+
     '<div class="rka-st" style="--d:4"><b>'+(p.best||0)+'%</b><small>Best score</small></div>'+
     '<div class="rka-st" style="--d:5"><b>'+(rank?'#'+rank:'-')+'</b><small>Class rank</small></div></div>';
  // trend
  var last=res.slice(0,10).reverse();
  h+='<div class="rka-box"><h4>Last '+(last.length||0)+' tests</h4>';
  if(!last.length)h+='<p class="rka-emp">No test yet. Take your first practice test and your progress will show here.</p>';
  else{h+='<div class="rka-bars">'+last.map(function(r){var d=new Date(r.t);var c=r.pct>=75?'#1fa65a':r.pct>=50?'#e0a100':'#e5533d';return '<div class="rka-bar" title="'+esc(r.sub)+'"><em>'+r.pct+'%</em><i style="height:0;background:'+c+'" data-h="'+Math.max(4,Math.round(r.pct*0.74))+'"></i><span>'+d.getDate()+'/'+(d.getMonth()+1)+'</span></div>';}).join('')+'</div>';}
  h+='</div>';
  // weak chapters
  var agg={};res.forEach(function(r){(r.chapters||[]).forEach(function(c){var o=agg[c.k]||(agg[c.k]={c:0,t:0});o.c+=c.c;o.t+=c.t;});});
  var wk=Object.keys(agg).map(function(k){return {k:k,c:agg[k].c,t:agg[k].t,p:agg[k].c/agg[k].t};}).filter(function(x){return x.p<0.8;}).sort(function(u,v){return u.p-v.p;}).slice(0,6);
  h+='<div class="rka-box"><h4>Chapters to revise</h4>';
  if(!res.length)h+='<p class="rka-emp">Your weak chapters will appear after a few tests.</p>';
  else if(!wk.length)h+='<p class="rka-emp">Great work. No weak chapter found in your recent tests.</p>';
  else h+=wk.map(function(x){var pc2=Math.round(x.p*100),c=pc2>=50?'#e0a100':'#e5533d';return '<div class="rka-wk"><span>'+esc(x.k)+'</span><div class="rka-wt"><i style="width:0;background:'+c+'" data-w="'+pc2+'"></i></div><em>'+x.c+'/'+x.t+'</em></div>';}).join('');
  h+='</div>';
  // badges
  var have=p.badges||[];
  h+='<div class="rka-box"><h4>Badges ('+have.length+'/'+BADGES.length+')</h4><div class="rka-bdgs">'+BADGES.map(function(x){var on=have.indexOf(x.id)>=0;return '<div class="rka-bg'+(on?' on':'')+'"><b>'+esc(x.name)+'</b><span>'+esc(x.desc)+'</span></div>';}).join('')+'</div></div>';
  // recent
  h+='<div class="rka-box"><h4>Recent tests</h4>';
  if(!res.length)h+='<p class="rka-emp">Nothing here yet.</p>';
  else h+='<div class="rka-rl">'+res.slice(0,8).map(function(r){var d=new Date(r.t),c=r.pct>=75?'g':r.pct>=50?'y':'r';return '<div class="rka-r"><div><b>Class '+esc(r.cls)+' : '+esc(r.sub)+'</b><span>'+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'  |  '+Math.floor(r.secs/60)+'m '+(r.secs%60)+'s</span></div><em class="'+c+'">'+(Math.round(r.score*100)/100)+'/'+r.n+'</em></div>';}).join('')+'</div>';
  h+='</div>';
  // leaderboard
  h+='<div class="rka-box"><h4>Class '+esc(p.cls)+' leaderboard</h4><div class="rka-lb">';
  var top=bd.slice(0,10);
  top.forEach(function(u,i){h+='<div class="rka-lr'+(u.id===p.id?' me':'')+'"><span class="n">'+(i+1)+'</span><b>'+esc(u.name)+(u.id===p.id?' (You)':'')+'</b><em>'+(u.xp||0)+' XP</em></div>';});
  if(rank>10)h+='<div class="rka-lr me"><span class="n">'+rank+'</span><b>'+esc(p.name)+' (You)</b><em>'+xp+' XP</em></div>';
  if(!top.length)h+='<p class="rka-emp">No one has practised in your class yet. Be the first.</p>';
  h+='</div></div>';
  h+='<div class="rka-acts"><button type="button" class="rka-pb" id="rka-prac">Practice now</button><button type="button" class="rka-lo" id="rka-logout">Logout</button></div>';
  var body=$('#rka-dbody');body.innerHTML=h;body.scrollTop=0;
  $('#rka-prac').onclick=function(){closeDash();var s=$('#practice');if(s)s.scrollIntoView({behavior:'smooth'});else location.href='practice.html';};
  $('#rka-logout').onclick=function(){logout();};
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    $$('[data-w]',body).forEach(function(i){i.style.width=i.dataset.w+'%';});
    $$('[data-h]',body).forEach(function(i){i.style.height=i.dataset.h+'%';});
  });});
}
function bindDash(){
  $('#rka-dx').addEventListener('click',closeDash);
}

document.addEventListener('keydown',function(e){
  if(e.key!=='Escape')return;
  if(!$('#rka-lg').hidden)closeLogin();else if(!$('#rka-db').hidden)closeDash();
});

mount();bindLogin();bindDash();
window.RKAccount={
  ready:READY,
  name:function(){return me?me.name:null;},
  openLogin:openLogin,
  openDashboard:openDashboard,
  toggle:function(){navClick();},
  saveResult:saveResult,
  onSaved:null
};
if(document.readyState==='complete')setTimeout(boot,200);else window.addEventListener('load',function(){setTimeout(boot,200);});
})();

