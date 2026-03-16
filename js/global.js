document.addEventListener('DOMContentLoaded', () => {

  // ── Theme Toggle ──────────────────────────
  const THEME_KEY = 'ftl-theme';
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);

  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeIcon(next);
  };
  function updateThemeIcon(theme) {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  }

  // ── Custom Cursor ──────────────────────────
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (cursor && ring) {
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      cursor.style.left=mx+'px'; cursor.style.top=my+'px';
    });
    (function animRing(){
      rx+=(mx-rx)*.11; ry+=(my-ry)*.11;
      ring.style.left=rx+'px'; ring.style.top=ry+'px';
      requestAnimationFrame(animRing);
    })();
    document.querySelectorAll('a,button,.service-card,.tech-pill,.why-item,.portfolio-card,.team-card,.blog-card,.testimonial-card,.value-card,.sub-card,.contact-detail-item').forEach(el=>{
      el.addEventListener('mouseenter',()=>{cursor.classList.add('hovered');ring.classList.add('hovered');});
      el.addEventListener('mouseleave',()=>{cursor.classList.remove('hovered');ring.classList.remove('hovered');});
    });
  }

  // ── Animated Grid Canvas ──────────────────
  const canvas = document.getElementById('grid-canvas');
  // Skip canvas on mobile — saves battery and CPU
  if (canvas && window.innerWidth > 768) {
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const dots = Array.from({length:70}, () => ({
      x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
      vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25, r:Math.random()*1.2+.4
    }));
    let mx=-999,my=-999;
    document.addEventListener('mousemove', e=>{mx=e.clientX;my=e.clientY;});
    (function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const isLight = document.documentElement.getAttribute('data-theme')==='light';
      const dotColor = isLight ? '140,60,20' : '196,81,31';
      const gridAlpha = isLight ? '.025' : '.035';
      ctx.strokeStyle=`rgba(${dotColor},${gridAlpha})`; ctx.lineWidth=1;
      for(let x=0;x<canvas.width;x+=64){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
      for(let y=0;y<canvas.height;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
      dots.forEach(d=>{
        d.x+=d.vx; d.y+=d.vy;
        if(d.x<0||d.x>canvas.width)d.vx*=-1;
        if(d.y<0||d.y>canvas.height)d.vy*=-1;
      });
      for(let i=0;i<dots.length;i++){
        for(let j=i+1;j<dots.length;j++){
          const dx=dots[i].x-dots[j].x,dy=dots[i].y-dots[j].y,dist=Math.hypot(dx,dy);
          if(dist<110){ctx.strokeStyle=`rgba(${dotColor},${(1-dist/110)*(isLight?.08:.13)})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(dots[i].x,dots[i].y);ctx.lineTo(dots[j].x,dots[j].y);ctx.stroke();}
        }
        const md=Math.hypot(dots[i].x-mx,dots[i].y-my);
        if(md<190){ctx.strokeStyle=`rgba(232,98,42,${(1-md/190)*(isLight?.3:.55)})`;ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(dots[i].x,dots[i].y);ctx.lineTo(mx,my);ctx.stroke();}
      }
      dots.forEach(d=>{
        const md=Math.hypot(d.x-mx,d.y-my);
        ctx.fillStyle=`rgba(${dotColor},${md<190?(isLight?.5:.85):(isLight?.2:.35)})`;
        ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  // ── Nav Scroll + Active ───────────────────
  const nav = document.querySelector('nav');
  if(nav){
    window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40));
    const path=window.location.pathname.split('/').pop()||'index.html';
    document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')===path)a.classList.add('active');});
  }

  // ── Mobile Hamburger ──────────────────────
  const ham=document.querySelector('.nav-hamburger');
  const navLinks=document.querySelector('.nav-links');
  if(ham&&navLinks){
    let menuOpen=false;
    function toggleMenu(force){
      menuOpen = force !== undefined ? force : !menuOpen;
      if(menuOpen){
        navLinks.style.cssText='display:flex;flex-direction:column;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(6,6,8,.97);padding:100px 32px 40px;gap:28px;z-index:198;justify-content:center;align-items:center;';
        ham.querySelector('span:nth-child(1)').style.cssText='transform:rotate(45deg) translate(5px,5px);';
        ham.querySelector('span:nth-child(2)').style.cssText='opacity:0;';
        ham.querySelector('span:nth-child(3)').style.cssText='transform:rotate(-45deg) translate(5px,-5px);';
        navLinks.querySelectorAll('a').forEach(a=>{a.style.cssText='font-size:22px;font-family:Syne,sans-serif;font-weight:700;color:#ede9e5;';});
      } else {
        navLinks.style.cssText='';
        ham.querySelectorAll('span').forEach(s=>s.style.cssText='');
      }
    }
    ham.addEventListener('click',()=>toggleMenu());
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click',()=>toggleMenu(false));
    });
    // Close on outside click
    document.addEventListener('click',e=>{
      if(menuOpen && !ham.contains(e.target) && !navLinks.contains(e.target)) toggleMenu(false);
    });
  }


  // ── Scroll Reveal ─────────────────────────
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('visible'),i*70);});
  },{threshold:.08});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>obs.observe(el));

  // ── Counter ───────────────────────────────
  const cObs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target, target=parseInt(el.dataset.count);
      const suffix=el.dataset.suffix||'', prefix=el.dataset.prefix||'';
      let start=null;
      const step=ts=>{if(!start)start=ts;const p=Math.min((ts-start)/1600,1),ease=1-Math.pow(1-p,3);el.textContent=prefix+Math.floor(ease*target)+suffix;if(p<1)requestAnimationFrame(step);};
      requestAnimationFrame(step); cObs.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>cObs.observe(el));

  // ── Toast ─────────────────────────────────
  window.showToast=(msg,icon='✓')=>{
    let t=document.querySelector('.toast');
    if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}
    t.innerHTML=`<span class="toast-icon">${icon}</span>${msg}`;
    t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),4000);
  };
});
