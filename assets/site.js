(function(){

"use strict";
var $=function(i){return document.getElementById(i)};
var RM=window.matchMedia?matchMedia('(prefers-reduced-motion:reduce)').matches:false;
var NUM='258873891176';

/* ---- ticker ---- */
var P=['Eletrónica','Roupa e calçado','Peças auto','Mobiliário','Cosméticos','Ferramentas','Brinquedos','Material de construção','Material de escritório','Decoração'];
var Q=['Alibaba','1688','Taobao','AliExpress','Made-in-China','Pinduoduo','uma foto serve'];
function fillT(el,a){if(!el)return;var h='',k,j;for(k=0;k<2;k++)for(j=0;j<a.length;j++)h+='<span>'+a[j]+'</span><i>&bull;</i>';el.innerHTML=h}
fillT($('t1'),P);fillT($('t2'),Q);


var wipe=$('wipe'),wt1,wt2;
function resetWipe(){if(!wipe)return;wipe.className='wipe nt';void wipe.offsetWidth;wipe.className='wipe'}
try{sessionStorage.removeItem('wp')}catch(e){}
if(document.documentElement.className==='wp'&&wipe){
  wipe.className='wipe in nt';
  document.documentElement.className='';
  void wipe.offsetWidth;
  wipe.className='wipe out';
  wt2=setTimeout(resetWipe,900);
}
window.addEventListener('pageshow',function(e){if(e.persisted){document.documentElement.className='';resetWipe()}});
document.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var el=e.target;while(el&&el.tagName!=='A')el=el.parentNode;
  if(!el||el.target||!el.href||el.origin!==location.origin)return;
  var same=el.pathname.replace(/index\.html$/,'').replace(/\/$/,'')===location.pathname.replace(/index\.html$/,'').replace(/\/$/,'');
  if(same)return;
  if(RM||!wipe)return;
  e.preventDefault();
  var href=el.href;
  try{sessionStorage.setItem('wp','1')}catch(x){}
  clearTimeout(wt1);wipe.className='wipe in';
  wt1=setTimeout(function(){location.href=href},420);
});
/* ---- scroll: barra de progresso e passos ---- */
var bar=$('bar'),fl=$('fill'),stp=$('steps');
var sts=[].slice.call(document.querySelectorAll('.st'));
function sc(){
  if(bar){
    var d=document.documentElement,m=d.scrollHeight-window.innerHeight;
    bar.style.transform='scaleX('+(m>0?Math.min(1,Math.max(0,window.pageYOffset/m)):0)+')';
  }
  if(stp&&fl){
    var r=stp.getBoundingClientRect();
    var p=r.height>0?Math.min(1,Math.max(0,(window.innerHeight*0.6-r.top)/r.height)):0;
    fl.style.transform='scaleY('+p+')';
    sts.forEach(function(s){
      if(s.getBoundingClientRect().top<window.innerHeight*0.62)s.classList.add('on');
      else s.classList.remove('on');
    });
  }
}
window.addEventListener('scroll',sc,{passive:true});
window.addEventListener('resize',sc);

/* ---- pedido de cotação ---- */
var mode='link',img=null,ref=Math.floor(1000+Math.random()*9000);
var HOME=!!$('fm');
var lk=$('lk'),ds=$('ds'),qt=$('qt'),nm=$('nm'),wp=$('wp'),er=$('er'),send=$('send'),pic=$('pic'),pd=$('pd'),rd=$('rd'),tags=$('tags'),dz=$('dz');
if($('ref'))$('ref').textContent=String(ref);

var N=[['alibaba','Alibaba'],['1688','1688'],['taobao','Taobao'],['aliexpress','AliExpress'],['made-in-china','Made-in-China'],['pinduoduo','Pinduoduo']];
function host(u){
  u=String(u||'').trim();if(!u)return '';
  try{return new URL(/^https?:\/\//i.test(u)?u:'https://'+u).hostname.replace(/^www\./,'')}catch(e){return ''}
}
function site(h){for(var i=0;i<N.length;i++)if(h.indexOf(N[i][0])>-1)return N[i][1];return h}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

function msg(){
  var l=['Olá DA-KA! Quero pedir uma cotação de um produto da China para Moçambique.','Ref.: DK-'+ref];
  if(mode==='link'&&lk.value.trim())l.push('Link: '+lk.value.trim());
  if(mode==='foto')l.push('Vou anexar a foto do produto nesta conversa.');
  l.push('Produto: '+(ds.value.trim()||'-'));
  l.push('Quantidade: '+(qt.value||'1'));
  if(nm.value.trim())l.push('Nome: '+nm.value.trim());
  if(wp.value.trim())l.push('O meu WhatsApp: '+wp.value.trim());
  return l.join('\n');
}
function relink(){send.href='https://wa.me/'+NUM+'?text='+encodeURIComponent(msg())}
function pv(){
  var t='',q=parseInt(qt.value,10);
  if(mode==='link'){
    var h=host(lk.value);
    if(h){t+='<span class="tag">'+esc(site(h))+'</span>';pic.textContent='Produto do '+site(h)}
    else pic.textContent='O link aparece aqui';
  }else if(img){
    pic.innerHTML='<img alt="Foto do produto escolhida" src="'+img+'">';t+='<span class="tag">Foto</span>';
  }else pic.textContent='A foto aparece aqui';
  if(q>0)t+='<span class="tag">'+q+' un.</span>';
  tags.innerHTML=t;
  pd.textContent=ds.value.trim()||'Comece a escrever e veja o pedido a ganhar forma.';
  rd.hidden=true;
  relink();
}
[['tb-link','link'],['tb-foto','foto']].forEach(function(p){
  var b=$(p[0]);if(!b)return;
  b.addEventListener('click',function(){
    mode=p[1];
    $('tb-link').setAttribute('aria-pressed',String(mode==='link'));
    $('tb-foto').setAttribute('aria-pressed',String(mode==='foto'));
    $('bl').hidden=(mode!=='link');
    $('bf').hidden=(mode!=='foto');
    pv();
  });
});
['lk','ds','qt','nm','wp'].forEach(function(i){var e=$(i);if(e)e.addEventListener('input',pv)});
if($('ph'))$('ph').addEventListener('change',function(e){
  var f=e.target.files&&e.target.files[0];if(!f)return;
  if(img)try{URL.revokeObjectURL(img)}catch(x){}
  img=URL.createObjectURL(f);
  dz.textContent='Trocar foto ('+f.name+')';
  pv();
});
if(HOME)send.addEventListener('click',function(e){
  var m='';
  if(mode==='link'&&!host(lk.value))m='Cole o link do produto ou mude para "Tenho uma foto".';
  else if(mode==='foto'&&!img)m='Escolha uma foto do produto.';
  else if(!ds.value.trim())m='Descreva o que precisa: cor, tamanho ou modelo.';
  else if(!(parseInt(qt.value,10)>=1))m='A quantidade tem de ser 1 ou mais.';
  else if(wp.value.replace(/\D/g,'').length<7)m='Indique o seu WhatsApp para podermos responder.';
  er.textContent=m;
  if(m){e.preventDefault();return}
  relink();rd.hidden=false;
});
if(HOME){$('fm').addEventListener('submit',function(e){e.preventDefault()});pv();}

/* ---- contactos ---- */
var cn=$('cn'),cm=$('cm'),cwa=$('cwa');
function clink(){
  var t='Olá DA-KA! '+(cn.value.trim()?'Sou '+cn.value.trim()+'. ':'')+(cm.value.trim()||'Gostaria de falar com a vossa equipa.');
  cwa.href='https://wa.me/'+NUM+'?text='+encodeURIComponent(t);
}
if(cn){cn.addEventListener('input',clink);cm.addEventListener('input',clink);clink();$('cf').addEventListener('submit',function(e){e.preventDefault()});}

sc();
})();
