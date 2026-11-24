/* Collectible coins, demo wallet, ledger coin pour and card flip */
(()=>{
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const read=(k,d)=>{try{return JSON.parse(sessionStorage.getItem(k))??d}catch(e){return d}};
const save=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let pts=read('fc',0);
const hud=document.createElement('div');hud.className='hud';hud.setAttribute('aria-live','polite');
hud.innerHTML='<i></i><span><b id="hudN">0</b><small>DEMO POINTS</small></span>';document.body.append(hud);
const sync=()=>{$('#hudN').textContent=pts;if(pts)hud.classList.add('show');const g=$('.gath');if(g&&pts){g.hidden=false;$('#gathN').textContent=pts}};sync();
const drop=n=>n.parentNode&&n.parentNode.removeChild(n);
const fly=(x,y,tx,ty,d=0,dur=850)=>{if(calm)return;const m=document.createElement('i');m.className='mini';document.body.append(m);
 const mx=(x+tx)/2+(Math.random()-.5)*160,my=Math.min(y,ty)-70-Math.random()*90;
 m.animate([{transform:`translate(${x}px,${y}px) scale(1.2)`},{transform:`translate(${mx}px,${my}px) scale(1) rotateY(360deg)`,offset:.5},{transform:`translate(${tx}px,${ty}px) scale(.5) rotateY(720deg)`}],{duration:dur,delay:d,easing:'cubic-bezier(.4,0,.3,1)',fill:'both'}).onfinish=()=>drop(m)};
const collect=(c,k)=>{if(c.classList.contains('got'))return;window.finchSound&&finchSound.play('coin');c.classList.add('got');save('fg',[...read('fg',[]),k]);
 const r=c.getBoundingClientRect();hud.classList.add('show');const h=hud.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
 for(let i=0;i<7;i++)fly(x,y,h.left+18,h.top+16,i*55);
 const p=document.createElement('div');p.className='plusn';p.textContent='+10';p.style.cssText=`left:${x-18}px;top:${y-30}px`;document.body.append(p);
 p.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-60px)'}],{duration:900}).onfinish=()=>drop(p);
 setTimeout(()=>{pts+=10;save('fc',pts);sync();hud.classList.add('bump');setTimeout(()=>hud.classList.remove('bump'),350)},calm?0:800)};
const spots=[['[data-scene=receipts] .stick',90,74],['[data-scene=one] .stick',8,42],['[data-scene=tiers] .stick',6,16],['.year',90,12],['.promise',6,14],['.page-hero',6,34],['.cta',88,30]];
const page=location.pathname.split('/').pop()||'index.html',got=read('fg',[]);
spots.forEach(([q,x,y],i)=>{const host=$(q);if(!host)return;const k=page+i;if(got.includes(k))return;
 const b=document.createElement('button');b.className='coin';b.type='button';b.setAttribute('aria-label','Collect a gold coin worth 10 demo points');
 b.style.cssText=`left:${x}%;top:${y}%;animation-delay:${i*.4}s,${i*.3}s`;coin3d(b,innerWidth<900?54:70,6);b.onclick=()=>collect(b,k);
 if(getComputedStyle(host).position=='static')host.style.position='relative';host.append(b)});
const hc=$('#heroCoin');if(hc){const k='hero',go=()=>{if(window.heroCoin)heroCoin.boost+=720;if(!read('fg',[]).includes(k))collect({classList:{contains:()=>false,add(){}},getBoundingClientRect:()=>hc.getBoundingClientRect()},k)};hc.onclick=go;hc.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();go()}}}
const led=$('.ledger');if(led)new MutationObserver(ms=>ms.forEach(m=>{const e=m.target;if(!e.classList.contains('on')||e.dataset.d)return;e.dataset.d=1;
 const a=e.getBoundingClientRect(),t=$('#earnN').getBoundingClientRect();for(let i=0;i<6;i++)fly(a.right-40,a.top+10,t.left+t.width/2,t.top+t.height/2,i*70,700)})).observe(led,{subtree:true,attributes:true,attributeFilter:['class']});
$$('.mcard').forEach(c=>{c.removeAttribute('aria-hidden');c.setAttribute('role','button');c.tabIndex=0;c.setAttribute('aria-label','Flip the membership card');
 const b=document.createElement('div');b.className='mback';b.innerHTML='<div class="qr"></div><div><b>One scan.<br>Every outlet.</b><span>Your member QR, always ready in the app.</span></div>';c.append(b);
 const flip=()=>{window.finchSound&&finchSound.play('whoosh');if(calm){c.classList.toggle('flipped');return}const base=getComputedStyle(c).transform;c.animate([{transform:base},{transform:'rotateY(90deg)'}],{duration:220,easing:'ease-in'});setTimeout(()=>{c.classList.toggle('flipped');c.animate([{transform:'rotateY(-90deg)'},{transform:base}],{duration:260,easing:'ease-out'})},220)};
 c.onclick=flip;c.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();flip()}};
 const h=document.createElement('span');h.className='taphint';h.textContent='Tap the card to flip it';(c.closest('.mcard-stage,.one-card')||c.parentNode).append(h)});
})();
