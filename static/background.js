(function(){
  // Lightweight particle field creating a subtle 3D parallax effect.
  // Respects prefers-reduced-motion and is tuned for good performance.
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, DPR;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){
    canvas.style.display = 'none';
    return;
  }

  const config = {
    count: 80,
    baseSize: 2.6,
    depth: 1400,
    speed: 0.0006,
    hueStart: 205, // bluish
    hueEnd: 245
  };

  let mouseX = 0.5, mouseY = 0.5;
  window.addEventListener('pointermove', (e)=>{
    mouseX = e.clientX / width;
    mouseY = e.clientY / height;
  }, {passive:true});

  function resize(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.round(width * DPR);
    canvas.height = Math.round(height * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }

  window.addEventListener('resize', resize, {passive:true});

  function rand(a,b){ return a + Math.random()*(b-a); }

  const particles = [];
  function initParticles(){
    particles.length = 0;
    for(let i=0;i<config.count;i++){
      particles.push({
        x: Math.random(),
        y: Math.random(),
        z: Math.random(),
        size: rand(config.baseSize*0.5, config.baseSize*1.6),
        speed: rand(0.2,1.2)
      });
    }
  }

  function draw(time){
    ctx.clearRect(0,0,width,height);
    const cx = width/2, cy = height/2;
    // subtle background gradient
    const g = ctx.createLinearGradient(0,0,0,height);
    g.addColorStop(0, `rgba(6,11,29,0.6)`);
    g.addColorStop(1, `rgba(3,8,20,0.75)`);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,width,height);

    // parallax offsets from mouse
    const ox = (mouseX - 0.5) * 120;
    const oy = (mouseY - 0.5) * 80;

    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      // move particles slowly along z to simulate depth movement
      p.z -= config.speed * p.speed;
      if(p.z <= 0) p.z = 1;

      // perspective projection
      const perspective = 1 / (1 + (p.z * (config.depth/1000)) );
      const x = ((p.x - 0.5) * width * (1 + (1-perspective)*2)) + cx + ox * (1-perspective);
      const y = ((p.y - 0.5) * height * (1 + (1-perspective)*1.2)) + cy + oy * (1-perspective);
      const radius = p.size * (1 + (1-perspective)*10);

      // color based on depth
      const hue = config.hueStart + (config.hueEnd - config.hueStart) * (1 - p.z);
      const alpha = 0.08 + (1 - p.z) * 0.6;

      // soft glow using radial gradient
      const rg = ctx.createRadialGradient(x,y,0,x,y,radius*4);
      rg.addColorStop(0, `hsla(${hue},85%,65%,${alpha})`);
      rg.addColorStop(0.35, `hsla(${hue},75%,50%,${alpha*0.35})`);
      rg.addColorStop(1, `rgba(10,12,20,0)`);

      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(x, y, radius*3, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(draw);
  }

  // initialize
  resize();
  initParticles();
  // staggered re-init for stability on layout shifts
  setTimeout(()=>{ resize(); initParticles(); }, 200);

  // gentle respawn to keep variety
  setInterval(()=>{
    for(let i=0;i<Math.max(1, Math.floor(config.count*0.06)); i++){
      const idx = Math.floor(Math.random()*particles.length);
      particles[idx] = { x:Math.random(), y:Math.random(), z:1, size:rand(config.baseSize*0.6, config.baseSize*1.8), speed:rand(0.3,1.1) };
    }
  }, 4500);

  requestAnimationFrame(draw);
})();
