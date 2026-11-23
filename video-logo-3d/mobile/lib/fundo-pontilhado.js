// Fundo do site (petróleo #123e48 com o brilho #16818a no canto superior direito), igual ao
// radial-gradient(ellipse at 100% 0%, #16818a, transparent 66%), #123e48 do cartão de contato.
// É desenhado com pontilhado (dither) de ±1 nível, fixo em todos os quadros: num vídeo de 8 bits
// o degradê liso forma faixas; com o pontilhado a transição fica contínua e quase não pesa no arquivo.
const BASE = [0x12, 0x3e, 0x48];
const BRILHO = [0x16, 0x81, 0x8a];

// Ruído determinístico por pixel (sem Math.random), entre 0 e 1.
function ruido(x, y, s) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(s, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

export function desenharFundo(canvas, largura, altura) {
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(largura, altura);
  const px = img.data;
  // Elipse centrada no canto superior direito que passa pelo canto oposto (farthest-corner).
  const rx = largura * Math.SQRT2;
  const ry = altura * Math.SQRT2;
  let i = 0;
  for (let y = 0; y < altura; y++) {
    const dy = (y + 0.5) / ry;
    for (let x = 0; x < largura; x++) {
      const dx = (largura - x - 0.5) / rx;
      const t = Math.sqrt(dx * dx + dy * dy);
      const f = Math.max(0, 1 - t / 0.66);
      // Ruído triangular (soma de dois uniformes), o mesmo nos três canais: mexe só na luminância.
      const n = ruido(x, y, 1) + ruido(x, y, 2) - 1;
      for (let c = 0; c < 3; c++) {
        const v = BASE[c] + (BRILHO[c] - BASE[c]) * f + n;
        px[i + c] = Math.min(255, Math.max(0, Math.round(v)));
      }
      px[i + 3] = 255;
      i += 4;
    }
  }
  ctx.putImageData(img, 0, 0);
}
