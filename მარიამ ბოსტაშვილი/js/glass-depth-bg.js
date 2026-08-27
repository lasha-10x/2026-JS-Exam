/* ============================================================
   glass-depth-bg.js — BONUS visual layer (not part of the CRM).

   Draws the living background with a WebGL fragment shader: a blue
   gradient, slow drifting blobs and a grid that bends inward around
   the cursor, like pressing into a flexible membrane.

   It is completely self-contained: it reads no CRM state, writes no
   storage and exposes nothing. Delete the <script> tag and the app is
   unaffected — the CSS aurora in glass.css takes over again.

   Requires: three.min.js (r134) loaded before this file.
   ============================================================ */
(function () {
  if (!window.THREE) return; // no library, no bonus — the CSS aurora stays

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  /* This project stores the theme as a class on <body>, not an attribute. */
  const isDark = () => !document.body.classList.contains('theme-light');

  const canvas = document.createElement('canvas');
  canvas.id = 'depthbg';
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '-2',
    display: 'block',
  });
  document.body.prepend(canvas);

  /* Tell the stylesheet to drop its own aurora + grid: the shader draws
     both now, and two backgrounds stacked would muddy each other. */
  document.body.classList.add('depthbg-on');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.Camera();

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uStrength: { value: 0 },
    uDark: { value: isDark() ? 1 : 0 },
    uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime; uniform vec2 uMouse; uniform float uStrength;
      uniform float uDark; uniform vec2 uRes;

      float blob(vec2 uv, vec2 c, float r){ return smoothstep(r, 0.0, length(uv - c)); }

      void main(){
        vec2 uv = vUv;
        float aspect = uRes.x / uRes.y;
        vec2 auv = vec2(uv.x * aspect, uv.y);
        vec2 am  = vec2(uMouse.x * aspect, uMouse.y);
        float d = distance(auv, am);

        /* soft gaussian depth well around the cursor (no visible edge) */
        float well = exp(-d * d * 9.0) * uStrength;
        /* warp uv inward toward the cursor -> membrane / lens bend */
        vec2 wuv = uv - (uv - uMouse) * well * 0.6;

        /* base vertical gradient */
        vec3 top    = mix(vec3(0.84,0.82,0.93), vec3(0.02,0.03,0.10), uDark);
        vec3 bottom = mix(vec3(0.74,0.78,0.90), vec3(0.04,0.08,0.24), uDark);
        vec3 col = mix(top, bottom, uv.y);

        /* slow animated soft blobs (blue / cyan / violet) */
        float t = uTime * 0.05;
        vec3 c1 = mix(vec3(0.88,0.82,1.0), vec3(0.16,0.30,0.92), uDark);
        vec3 c2 = mix(vec3(0.80,0.73,0.96), vec3(0.46,0.34,0.96), uDark);
        vec3 c3 = mix(vec3(0.94,0.89,1.0), vec3(0.10,0.55,0.86), uDark);
        col += c1 * blob(wuv, vec2(0.22 + sin(t)*0.06, 0.76 + cos(t*0.8)*0.05), 0.55) * (uDark*0.5 + 0.1);
        col += c2 * blob(wuv, vec2(0.80 + cos(t*0.7)*0.06, 0.24 + sin(t)*0.05), 0.52) * (uDark*0.45 + 0.08);
        col += c3 * blob(wuv, vec2(0.55 + sin(t*0.5)*0.05, 0.55), 0.42) * (uDark*0.4 + 0.07);

        /* warped grid — bends inward near the cursor, fades with distance */
        float scale = 26.0;
        vec2 gv = abs(fract(wuv * scale) - 0.5);
        float line = smoothstep(0.46, 0.5, max(gv.x, gv.y));
        float gridA = line * (uDark*0.015 + 0.075) * smoothstep(1.1, 0.15, d);
        vec3 gridColor = mix(vec3(0.92,0.78,1.0), vec3(0.55,0.72,1.0), uDark);
        col += gridColor * gridA;

        /* subtle glow inside the depth well */
        col += mix(vec3(0.35,0.55,1.0), vec3(0.20,0.40,1.0), uDark) * well * 0.14;

        /* soft vignette */
        float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5)));
        col *= mix(0.94, 1.0, vig);

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  /* Interaction: the shader follows a target, it never snaps to it. */
  let tmx = 0.5,
    tmy = 0.5,
    tStrength = 0;

  if (!coarse && !reduce) {
    addEventListener(
      'mousemove',
      (e) => {
        tmx = e.clientX / innerWidth;
        tmy = 1.0 - e.clientY / innerHeight; // flip Y into uv space
        tStrength = 0.6;
      },
      { passive: true },
    );
    document.addEventListener('mouseleave', () => {
      tStrength = 0;
      tmx = 0.5;
      tmy = 0.5;
    });
  }

  const clock = new THREE.Clock();
  let running = true;

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);
    uniforms.uTime.value = clock.getElapsedTime();
    /* slow interpolation -> inertial, cinematic movement */
    uniforms.uMouse.value.x += (tmx - uniforms.uMouse.value.x) * 0.03;
    uniforms.uMouse.value.y += (tmy - uniforms.uMouse.value.y) * 0.03;
    uniforms.uStrength.value += (tStrength - uniforms.uStrength.value) * 0.04;
    renderer.render(scene, camera);
  }
  frame();

  /* Watch the <body> class instead of listening for a custom event, so this
     keeps working no matter how the CRM code toggles the theme.

     It also re-asserts depthbg-on: a theme toggle written as
     `body.className = 'theme-dark'` replaces every class rather than swapping
     one, which would silently drop our marker and let the CSS aurora reappear
     on top of the shader. */
  new MutationObserver(() => {
    uniforms.uDark.value = isDark() ? 1 : 0;
    if (!document.body.classList.contains('depthbg-on')) {
      document.body.classList.add('depthbg-on');
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  addEventListener(
    'resize',
    () => {
      renderer.setSize(innerWidth, innerHeight);
      uniforms.uRes.value.set(innerWidth, innerHeight);
    },
    { passive: true },
  );

  /* Stop rendering on a hidden tab — no reason to burn the GPU. */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      clock.getDelta();
      frame();
    }
  });
})();
