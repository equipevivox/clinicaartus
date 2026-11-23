// Cena 3D da logo da Clínica Artus, usada pela versão horizontal (index.html) e pela vertical (mobile.html).
// Tudo é desenhado a partir do tempo t: o HyperFrames pede cada quadro pelo evento hf-seek.
import * as THREE from "three";
import { SVGLoader } from "./three/SVGLoader.js";
import { RoomEnvironment } from "./three/RoomEnvironment.js";
import logoSvg from "./logo-artus.js";

const LOGO_LARGURA = 445; // viewBox da logo
const LOGO_ALTURA = 163;

export function montarCena({ canvas, largura, altura, larguraLogo, duracao = 3.5, chave = "logo3d" }) {
  const FOV = 18;
  const tanMeio = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  // Distância em que a logo, de frente, ocupa exatamente larguraLogo pixels.
  const distancia = (LOGO_LARGURA * altura) / (2 * tanMeio * larguraLogo);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(2); // desenha em dobro e reduz: bordas e textos pequenos ficam limpos
  renderer.setSize(largura, altura, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;

  const camera = new THREE.PerspectiveCamera(FOV, largura / altura, 10, distancia * 3);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x0b2a31, 0.9));
  const luzChave = new THREE.DirectionalLight(0xffffff, 2.0);
  luzChave.position.set(-380, 420, 700);
  luzChave.castShadow = true;
  luzChave.shadow.mapSize.set(2048, 2048);
  luzChave.shadow.radius = 4;
  luzChave.shadow.bias = -0.0005;
  Object.assign(luzChave.shadow.camera, { left: -300, right: 300, top: 200, bottom: -200, near: 100, far: 2200 });
  scene.add(luzChave);
  const contraluz = new THREE.DirectionalLight(0xbfe9ff, 1.0);
  contraluz.position.set(520, -160, -300);
  scene.add(contraluz);
  const varredura = new THREE.PointLight(0xffffff, 0, 0, 0);
  scene.add(varredura);

  const parede = new THREE.Mesh(
    new THREE.PlaneGeometry(3000, 2000),
    new THREE.ShadowMaterial({ color: 0x041a1f, opacity: 0.14 })
  );
  parede.position.z = -35;
  parede.receiveShadow = true;
  scene.add(parede);

  const logo = new THREE.Group();
  scene.add(logo);

  const faceMat = () =>
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.3,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      emissive: 0xffffff,
      emissiveIntensity: 0.42,
    });
  const ladoMat = () => new THREE.MeshStandardMaterial({ color: 0xc9dde0, roughness: 0.45, metalness: 0 });

  function peca(shapes, profundidade, bisel, sombra = true) {
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: profundidade,
      curveSegments: 28,
      bevelEnabled: bisel > 0,
      bevelThickness: bisel,
      bevelSize: bisel * 0.6,
      bevelSegments: 4,
    });
    geo.scale(1, -1, -1); // SVG desce no eixo y; inverter y e z juntos mantém as faces para fora.
    geo.computeBoundingBox();
    const centro = new THREE.Vector3();
    geo.boundingBox.getCenter(centro);
    geo.translate(-centro.x, -centro.y, -centro.z);
    const mats = [faceMat(), ladoMat()];
    const mesh = new THREE.Mesh(geo, mats);
    mesh.castShadow = sombra;
    const holder = new THREE.Group();
    holder.add(mesh);
    holder.userData.fim = new THREE.Vector3(centro.x - LOGO_LARGURA / 2, centro.y + LOGO_ALTURA / 2, 0);
    holder.userData.mats = mats;
    logo.add(holder);
    return holder;
  }

  const ease = {
    expo: gsap.parseEase("expo.out"),
    p3: gsap.parseEase("power3.out"),
    p3io: gsap.parseEase("power3.inOut"),
    back: gsap.parseEase("back.out(1.4)"),
    sine: gsap.parseEase("sine.inOut"),
    p2i: gsap.parseEase("power2.in"),
    p3i: gsap.parseEase("power3.in"),
  };
  const prog = (t, ini, dur, fn) => fn(Math.min(1, Math.max(0, (t - ini) / dur)));
  const mix = (a, b, p) => a + (b - a) * p;
  const setOpacidade = (holder, o) => {
    for (const m of holder.userData.mats) {
      m.opacity = o;
      m.transparent = o < 0.999;
      m.depthWrite = o > 0.98;
    }
    holder.visible = o > 0.001;
  };

  const dados = new SVGLoader().parse(logoSvg);
  const porId = {};
  for (const p of dados.paths) porId[p.userData.node.id] = p;

  const letras = porId["marca"]
    .toShapes()
    .map((s) => ({ s, x: s.getPoints().reduce((m, v) => Math.min(m, v.x), Infinity) }))
    .sort((a, b) => a.x - b.x)
    .map(({ s }) => peca([s], 14, 1.2));
  const arcos = ["arco-2", "arco-1", "arco-3"].map((id) => peca(porId[id].toShapes(), 14, 1.2));
  const cabeca = peca(porId["cabeca"].toShapes(), 14, 1.2);
  const textoSup = peca(porId["texto-superior"].toShapes(), 3, 0, false);
  const textoInf = peca(porId["texto-inferior"].toShapes(), 3, 0, false);

  // Linha do tempo (segundos): entrada 0–1,9 · pausa com brilho 1,9–2,5 · saída 2,5–3,3 · fundo limpo até o fim.
  // A saída espelha a entrada: as peças seguem o mesmo giro e o mesmo sentido, com curvas "in" no lugar das "out".
  const SAIDA = 2.5;

  function renderAt(t) {
    t = Math.min(duracao, Math.max(0, t));

    // Conjunto: chega girando de leve, assenta de frente e, na saída, continua o mesmo giro.
    const pc = prog(t, 0, 1.7, ease.p3io);
    const ps = prog(t, SAIDA, 0.85, ease.p2i);
    camera.position.set(0, 0, mix(distancia * 1.08, distancia, prog(t, 0, 1.9, ease.p3)) - distancia * 0.05 * ps);
    camera.lookAt(0, 0, 0);
    logo.rotation.set(mix(0.1, 0, pc) - 0.07 * ps, mix(-0.32, 0, pc) + 0.24 * ps, 0);

    // Saída de cada peça: avança no mesmo sentido em que entrou e some.
    const sai = (ini, dur) => prog(t, ini, dur, ease.p3i);

    // A sombra acompanha a presença da logo, para não sobrar sozinha na tela.
    const presenca = Math.min(prog(t, 0.15, 0.7, ease.p3), 1 - prog(t, SAIDA, 0.7, ease.p2i));
    parede.material.opacity = 0.14 * presenca;

    arcos.forEach((h, i) => {
      const ini = 0.05 + i * 0.08;
      const p = prog(t, ini, 0.9, ease.expo);
      const q = sai(SAIDA + 0.12 + i * 0.06, 0.6);
      const f = h.userData.fim;
      const lado = i === 1 ? -1 : 1;
      h.position.set(
        f.x + mix(14 * lado, 0, p) - 12 * lado * q,
        f.y + mix(-10, 0, p) + 10 * q,
        mix(-50, 0, p) + 40 * q
      );
      h.rotation.set(0, mix(0.45 * lado, 0, p) - 0.35 * lado * q, mix(-0.22 * lado, 0, p) + 0.18 * lado * q);
      setOpacidade(h, prog(t, ini, 0.4, ease.p3) * (1 - q));
    });

    {
      const ini = 0.55;
      const q = sai(SAIDA + 0.05, 0.5);
      const f = cabeca.userData.fim;
      const s = mix(0.6, 1, prog(t, ini, 0.6, ease.back)) * mix(1, 0.7, q);
      cabeca.position.set(f.x, f.y + mix(16, 0, prog(t, ini, 0.6, ease.expo)) + 14 * q, 0);
      cabeca.scale.set(s, s, s);
      setOpacidade(cabeca, prog(t, ini, 0.3, ease.p3) * (1 - q));
    }

    letras.forEach((h, i) => {
      const ini = 0.2 + i * 0.06;
      const p = prog(t, ini, 0.9, ease.expo);
      const q = sai(SAIDA + 0.08 + i * 0.05, 0.6);
      const f = h.userData.fim;
      h.position.set(f.x, f.y + mix(-12, 0, p) + 12 * q, mix(-20, 0, p) + 20 * q);
      h.rotation.set(mix(-0.6, 0, p) + 0.6 * q, 0, 0);
      setOpacidade(h, prog(t, ini, 0.4, ease.p3) * (1 - q));
    });

    // Os textos pequenos entram por último e saem primeiro.
    [textoSup, textoInf].forEach((h, i) => {
      const ini = 0.95 + i * 0.1;
      const p = prog(t, ini, 0.7, ease.p3);
      const q = prog(t, SAIDA - 0.05 + i * 0.05, 0.4, ease.p2i);
      const f = h.userData.fim;
      const dir = i === 0 ? 1 : -1;
      h.position.set(f.x, f.y + mix(5 * dir, 0, p) - 5 * dir * q, 0);
      setOpacidade(h, p * (1 - q));
    });

    // Um brilho discreto atravessa a logo enquanto ela está parada.
    const pv = prog(t, 1.45, 0.95, ease.sine);
    varredura.position.set(mix(-450, 450, pv), mix(90, -30, pv), 160);
    varredura.intensity = Math.sin(Math.PI * pv) * 1.2;

    renderer.render(scene, camera);
  }

  window.__hf = window.__hf || {};
  window.__hf.buildReady = window.__hf.buildReady || {};
  const pronto = renderer.compileAsync(scene, camera).then(() => renderAt(0));
  window.__hf.buildReady[chave] = pronto;

  window.addEventListener("hf-seek", (e) => {
    const t = e.detail.time;
    renderAt(t);
  });
  renderAt(0);
  return { renderAt, pronto };
}
