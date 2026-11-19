/* AERVANTA HEATING & COOLING — shared interactions (vanilla JS, no dependencies) */
(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function init(){
 var root=$(".av");if(!root)return;
 $$("[data-av-year]").forEach(function(e){e.textContent=new Date().getFullYear()});

 /* Sticky header shadow */
 var hd=$("[data-av-header]");
 if(hd){var onS=function(){hd.classList.toggle("is-stuck",window.scrollY>8)};onS();window.addEventListener("scroll",onS,{passive:true})}

 /* Mobile menu */
 var bg=$("[data-av-burger]"),nav=$("#av-nav"),shade=null;
 function closeNav(){if(!nav)return;nav.classList.remove("is-open");bg.setAttribute("aria-expanded","false");bg.setAttribute("aria-label","Open menu");document.body.classList.remove("av-lock");if(shade){shade.remove();shade=null}}
 if(bg&&nav){bg.addEventListener("click",function(){var o=!nav.classList.contains("is-open");if(!o){closeNav();return}
   nav.classList.add("is-open");bg.setAttribute("aria-expanded","true");bg.setAttribute("aria-label","Close menu");document.body.classList.add("av-lock");
   shade=document.createElement("div");shade.className="av-nav-bg";shade.addEventListener("click",closeNav);(hd||root).appendChild(shade);var f=$("a",nav);if(f)f.focus()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("is-open")){closeNav();bg.focus()}});
  window.addEventListener("resize",function(){if(window.innerWidth>1024)closeNav()});
  $$("a",nav).forEach(function(a){a.addEventListener("click",closeNav)})}
 $$(".av-sub-tg").forEach(function(t){t.addEventListener("click",function(){var li=t.parentNode,o=li.classList.toggle("is-open");t.setAttribute("aria-expanded",o?"true":"false")})});

 /* Scroll reveal */
 var rv=$$(".av-rv");
 if("IntersectionObserver" in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("is-in");io.unobserve(e.target)}})},{rootMargin:"0px 0px -8% 0px",threshold:.08});
  rv.forEach(function(e){io.observe(e)});
 }else{root.classList.add("no-io")}

 /* Project filter */
 var grid=$("[data-av-projects]"),cnt=$("[data-av-count]");
 $$("[data-av-filter]").forEach(function(b){b.addEventListener("click",function(){
  var c=b.getAttribute("data-av-filter"),n=0;
  $$("[data-av-filter]").forEach(function(x){var on=x===b;x.classList.toggle("is-on",on);x.setAttribute("aria-pressed",on?"true":"false")});
  $$(".av-work",grid).forEach(function(p){var show=c==="all"||p.getAttribute("data-cat")===c;p.hidden=!show;if(show){n++;p.classList.add("is-in")}});
  if(cnt)cnt.textContent="Showing "+n+" project "+(n===1?"type":"types")+(c==="all"?"":" in "+c);
 })});

 /* Project gallery modal */
 var dataEl=$("#av-proj-data"),modal=$("[data-av-modal]");
 if(dataEl&&modal){
  var D={};try{D=JSON.parse(dataEl.textContent)}catch(e){}
  var box=$(".av-modal-box",modal),mimg=$("[data-av-mimg]",modal),thumbs=$("[data-av-mthumbs]",modal),mc=$("[data-av-mcount]",modal),cur=null,ix=0,last=null;
  function show(i){var im=cur.imgs;ix=(i+im.length)%im.length;mimg.src=im[ix].s;mimg.alt=im[ix].a;mc.textContent=(ix+1)+" / "+im.length;
   $$("button",thumbs).forEach(function(b,j){b.classList.toggle("is-on",j===ix);b.setAttribute("aria-current",j===ix?"true":"false")})}
  function open(id){cur=D[id];if(!cur)return;last=document.activeElement;
   $("[data-av-mtitle]",modal).textContent=cur.title;$("[data-av-mcat]",modal).textContent=cur.cat;$("[data-av-mcity]",modal).textContent=cur.city;
   $("[data-av-mprob]",modal).textContent=cur.problem;$("[data-av-msol]",modal).textContent=cur.solution;
   $("[data-av-mscope]",modal).innerHTML=cur.scope.map(function(s){return '<li><svg class="av-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.8 10A10 10 0 1 1 17 3.33"/><path d="m9 11 3 3L22 4"/></svg>'+esc(s)+'</li>'}).join("");
   thumbs.innerHTML=cur.imgs.map(function(m,j){return '<button type="button" aria-label="Show photo '+(j+1)+'"><img src="'+esc(m.s.replace("w=1600&h=1200","w=320&h=240"))+'" alt=""></button>'}).join("");
   $$("button",thumbs).forEach(function(b,j){b.addEventListener("click",function(){show(j)})});
   show(0);modal.hidden=false;document.body.classList.add("av-lock");box.focus();
   if(history.replaceState)history.replaceState(null,"","#"+id)}
  function close(){modal.hidden=true;document.body.classList.remove("av-lock");if(history.replaceState)history.replaceState(null,"",location.pathname+location.search);if(last&&last.focus)last.focus()}
  $$("[data-av-project]").forEach(function(b){b.addEventListener("click",function(){open(b.getAttribute("data-av-project"))})});
  $$("[data-av-close]",modal).forEach(function(b){b.addEventListener("click",close)});
  $("[data-av-prev]",modal).addEventListener("click",function(){show(ix-1)});
  $("[data-av-next]",modal).addEventListener("click",function(){show(ix+1)});
  document.addEventListener("keydown",function(e){if(modal.hidden)return;
   if(e.key==="Escape")close();else if(e.key==="ArrowLeft")show(ix-1);else if(e.key==="ArrowRight")show(ix+1);
   else if(e.key==="Tab"){var f=$$("button,a[href]",box).filter(function(x){return x.offsetParent!==null});if(!f.length)return;var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&(document.activeElement===a||document.activeElement===box)){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
  var h=location.hash.replace("#","");if(h&&D[h])setTimeout(function(){open(h)},150);
  window.addEventListener("hashchange",function(){var k=location.hash.replace("#","");if(k&&D[k]&&modal.hidden)open(k)});
 }
 /* Prefill from query string (?service= / ?city= / ?topic=) */
 var q={};location.search.replace(/^\?/,"").split("&").forEach(function(p){if(!p)return;var kv=p.split("=");q[decodeURIComponent(kv[0])]=decodeURIComponent((kv[1]||"").replace(/\+/g," "))});
 function pre(sel,val){$$(sel).forEach(function(el){$$("option",el).forEach(function(o){if(o.value===val||o.textContent===val)el.value=o.value})})}
 if(q.service){pre("[data-av-service]",q.service);var m={"ac-repair":"cooling","ac-installation":"cooling","ac-maintenance":"maintenance","heating-repair":"heating","heating-installation":"heating","furnace-maintenance":"maintenance","heat-pump-services":"heat-pump","ductless-mini-split":"ductless","indoor-air-quality":"iaq","commercial-hvac":"commercial"};if(m[q.service])pre("#e_cat",m[q.service])}
 if(q.city)pre("[data-av-city]",q.city);
 if(q.topic)pre("[data-av-topic]",q.topic);

 /* Home appointment card: next 4 weekdays as day choices; hands off to Schedule Service with ?date=&time= */
 $$("[data-av-days]").forEach(function(box){var d=new Date(),out="",n=0,DN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],MN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],p=function(x){return(x<10?"0":"")+x};
  d.setDate(d.getDate()+1);
  while(n<4){if(d.getDay()!==0){var v=d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate());out+='<label><input type="radio" name="date" value="'+v+'"'+(n===0?" checked":"")+'><span><small>'+DN[d.getDay()]+'</small><b>'+d.getDate()+'</b><em>'+MN[d.getMonth()]+'</em></span></label>';n++}d.setDate(d.getDate()+1)}
  box.innerHTML=out});
 if(q.date){var di=$("#s_date");if(di&&/^\d{4}-\d{2}-\d{2}$/.test(q.date))di.value=q.date}
 if(q.time)pre("#s_time",q.time);
 /* Service carousel */
 $$("[data-av-car]").forEach(function(car){var sec=car.closest("section"),pv=$("[data-av-car-prev]",sec),nx=$("[data-av-car-next]",sec);
  function step(){var c=car.firstElementChild;return c?c.getBoundingClientRect().width+26:300}
  function upd(){if(!pv)return;pv.disabled=car.scrollLeft<4;nx.disabled=car.scrollLeft+car.clientWidth>=car.scrollWidth-4}
  if(pv)pv.addEventListener("click",function(){car.scrollBy({left:-step(),behavior:"smooth"})});
  if(nx)nx.addEventListener("click",function(){car.scrollBy({left:step(),behavior:"smooth"})});
  car.addEventListener("keydown",function(e){if(e.target!==car)return;if(e.key==="ArrowRight"){e.preventDefault();car.scrollBy({left:step(),behavior:"smooth"})}else if(e.key==="ArrowLeft"){e.preventDefault();car.scrollBy({left:-step(),behavior:"smooth"})}});
  var t;car.addEventListener("scroll",function(){clearTimeout(t);t=setTimeout(upd,60)},{passive:true});window.addEventListener("resize",upd);upd()});

 /* Accessible tabs (system showcase) */
 $$("[data-av-tabs]").forEach(function(w){var tabs=$$('[role="tab"]',w);
  function sel(t,f){tabs.forEach(function(x){var on=x===t;x.setAttribute("aria-selected",on?"true":"false");x.tabIndex=on?0:-1;x.classList.toggle("is-on",on);var p=document.getElementById(x.getAttribute("aria-controls"));if(p)p.hidden=!on});if(f)t.focus()}
  tabs.forEach(function(t,i){t.addEventListener("click",function(){sel(t)});t.addEventListener("keydown",function(e){var k=e.key,n=null;
   if(k==="ArrowRight"||k==="ArrowDown")n=tabs[(i+1)%tabs.length];else if(k==="ArrowLeft"||k==="ArrowUp")n=tabs[(i-1+tabs.length)%tabs.length];else if(k==="Home")n=tabs[0];else if(k==="End")n=tabs[tabs.length-1];
   if(n){e.preventDefault();sel(n,true)}})})});

 /* File input label */
 $$("[data-av-file]").forEach(function(inp){inp.addEventListener("change",function(){var l=$("[data-av-filelabel]",inp.parentNode),fs=Array.prototype.slice.call(inp.files||[]);
  var err=$("#e-"+inp.id),f=inp.closest(".av-field");if(err)err.textContent="";f.classList.remove("is-bad");
  if(fs.length>3){if(err)err.textContent="Please choose up to 3 photos.";f.classList.add("is-bad")}
  else if(fs.some(function(x){return x.type&&x.type.indexOf("image/")!==0})){if(err)err.textContent="Please choose image files only.";f.classList.add("is-bad")}
  l.textContent=fs.length?fs.map(function(x){return x.name}).join(", "):"Choose photos"})});

 /* Forms: validation + confirmation summary.
    GHL HOOK: when connected to a native GHL form or workflow, submit `data` there. Until connected, submissions are not transmitted. */
 var today=new Date();today.setHours(0,0,0,0);
 function check(el){
  var f=el.closest(".av-field"),err=f?$(".av-err",f):null,v=(el.value||"").trim(),m="",lab=el.getAttribute("data-label")||"This field";
  if(el.type==="radio"){var g=$$('input[name="'+el.name+'"]',el.form);if(el.required||g.some(function(x){return x.required})){if(!g.some(function(x){return x.checked}))m="Please choose a "+lab.toLowerCase()+"."}}
  else if(el.type==="checkbox"){if(el.required&&!el.checked)m="Please confirm to continue."}
  else if(el.type==="file"){var fs=el.files||[];if(fs.length>3)m="Please choose up to 3 photos."}
  else if(el.required&&!v)m=lab+" is required.";
  else if(v&&el.type==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))m="Please enter a valid email address.";
  else if(v&&el.type==="tel"&&v.replace(/\D/g,"").length<10)m="Please enter a 10-digit phone number.";
  else if(v&&el.minLength>0&&v.length<el.minLength)m="Please add a little more detail (at least "+el.minLength+" characters).";
  else if(v&&el.hasAttribute("data-av-future")){var d=new Date(v+"T00:00:00");if(isNaN(d)||d<today)m="Please choose today or a future date."}
  if(f){f.classList.toggle("is-bad",!!m);f.classList.toggle("is-ok",!m&&(v!==""||el.checked))}
  if(err)err.textContent=m;
  if(el.type!=="radio"){el.setAttribute("aria-invalid",m?"true":"false");if(err&&err.id)el.setAttribute("aria-errormessage",err.id)}
  return !m}
 $$("[data-av-form]").forEach(function(form){
  var dateIn=$("[data-av-future]",form);if(dateIn){var t=new Date(),p=function(n){return(n<10?"0":"")+n};dateIn.min=t.getFullYear()+"-"+p(t.getMonth()+1)+"-"+p(t.getDate())}
  var fields=$$("input,select,textarea",form).filter(function(e){return e.name});
  fields.forEach(function(el){el.addEventListener("blur",function(){if(el.value||el.closest(".av-field").classList.contains("is-bad"))check(el)});el.addEventListener("change",function(){if(el.closest(".av-field").classList.contains("is-bad")||el.type==="radio"||el.type==="checkbox")check(el)})});
  var done=form.parentNode.querySelector("[data-av-done]");
  form.addEventListener("submit",function(e){e.preventDefault();var ok=true,first=null,seen={};
   fields.forEach(function(el){if(el.type==="radio"){if(seen[el.name])return;seen[el.name]=1}if(!check(el)){ok=false;if(!first)first=el}});
   if(!ok){first.focus();return}
   var data={},dl=done?$("[data-av-summary]",done):null,rows="";seen={};
   fields.forEach(function(el){var lab=el.getAttribute("data-label")||el.name,v="";
    if(el.type==="radio"){if(seen[el.name])return;seen[el.name]=1;var c=$('input[name="'+el.name+'"]:checked',form);v=c?c.value:""}
    else if(el.type==="checkbox"){v=el.checked?"Yes":"No"}
    else if(el.type==="file"){v=Array.prototype.slice.call(el.files||[]).map(function(x){return x.name}).join(", ")}
    else if(el.tagName==="SELECT"){v=el.value?el.options[el.selectedIndex].text:""}
    else v=el.value.trim();
    data[el.name]=v;if(v&&el.name!=="consent")rows+="<dt>"+esc(lab)+"</dt><dd>"+esc(v)+"</dd>"});
   if(dl)dl.innerHTML=rows;
   form.hidden=true;if(done){done.hidden=false;done.focus();done.scrollIntoView({behavior:"smooth",block:"center"})}
  });
  if(done){var rb=$("[data-av-reset]",done);if(rb)rb.addEventListener("click",function(){form.reset();$$(".av-field",form).forEach(function(f){f.classList.remove("is-ok","is-bad")});$$(".av-err",form).forEach(function(x){x.textContent=""});
   var fl=$("[data-av-filelabel]",form);if(fl)fl.textContent="Choose up to 3 photos (JPG or PNG)";done.hidden=true;form.hidden=false;var f1=$("input,select,textarea",form);if(f1)f1.focus()})}
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
