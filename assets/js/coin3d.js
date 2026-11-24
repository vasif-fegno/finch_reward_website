/* True 3D gold coin: stacked edge layers with two engraved faces */
window.coin3d=(host,size,layers=10)=>{
 const t=Math.round(size*.085),b=document.createElement('div');b.className='c3';b.style.setProperty('--d',size+'px');
 const s=document.createElement('div');s.className='c3b';
 for(let i=0;i<layers;i++){const l=document.createElement('i');l.className='l';l.style.transform=`translateZ(${-t/2+t*i/(layers-1)}px)`;s.append(l)}
 [['',t/2],['bk',t/2]].forEach(([k,z])=>{const f=document.createElement('div');f.className='f '+k;f.style.transform=(k?'rotateY(180deg) ':'')+`translateZ(${z}px)`;f.innerHTML=`<img src="assets/img/coin-poster${k?'-back':''}.webp" alt=""><em></em>`;s.append(f)});
 b.append(s);host.append(b);return s};
window.heroCoin={scroll:0,boost:0};
(()=>{const h=document.getElementById('heroCoin');if(!h||h.dataset.real!==undefined)return;
 const calm=matchMedia('(prefers-reduced-motion:reduce)').matches,size=Math.min(innerWidth*.86,innerHeight*.74,680),s=coin3d(h,size,14);
 const st=Object.assign(window.heroCoin,{mx:0,my:0});
 if(calm){s.style.transform='rotateX(10deg) rotateY(-16deg)';return}
 addEventListener('mousemove',e=>{st.mx=e.clientX/innerWidth-.5;st.my=e.clientY/innerHeight-.5});
 let cx=0,cy=0,t0=performance.now();
 (function loop(n){const t=(n-t0)/1000;cx+=(st.mx-cx)*.06;cy+=(st.my-cy)*.06;st.boost*=.965;
  const r=Math.sin(t*.7)*24+cx*36+st.scroll+st.boost,x=8+Math.sin(t*.5)*5-cy*24;
  s.style.transform=`translateY(${Math.sin(t*1.1)*10}px) rotateX(${x}deg) rotateY(${r}deg)`;requestAnimationFrame(loop)})(t0);
})();
