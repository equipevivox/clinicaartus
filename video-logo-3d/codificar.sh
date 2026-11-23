#!/usr/bin/env bash
# Gera os arquivos finais da animação da logo a partir do master sem perdas (PNG, 60 fps).
# Uso: bash codificar.sh   (rode depois de renderizar renders/master-png em horizontal/ e mobile/)
#
# Sobre as faixas no degradê: num vídeo de 8 bits com cor em meia resolução (4:2:0), um degradê
# suave como o petróleo do site vira anéis. Por isso:
#  - o fundo já vem com pontilhado (lib/fundo-pontilhado.js);
#  - a conversão para YUV passa por 16 bits e desce com difusão de erro (sws_dither=ed);
#  - as versões principais são 10 bits (VP9 perfil 2 e HEVC Main10), sem faixas;
#  - o H.264 de 8 bits fica como reserva para navegadores antigos.
# "DPI" não se aplica a vídeo: a resolução é em pixels (1920×1080 e 1080×1920, 60 fps).
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p entrega

COR=(-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv)
YUV16="scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p16le,scale=sws_dither=ed:flags=accurate_rnd"

for formato in horizontal mobile; do
  ENTRADA=(-framerate 60 -i "$formato/renders/master-png/frame_%06d.png")
  BASE="entrega/artus-logo-3d-$formato"
  rm -f "$BASE.webm" "$BASE.mp4" "$BASE-hevc.mp4" "$BASE-h264.mp4"

  # 1) VP9 10 bits (Chrome, Edge, Firefox): o menor e sem faixas.
  ffmpeg -v error -y "${ENTRADA[@]}" -vf "$YUV16,format=yuv420p10le" -c:v libvpx-vp9 -profile:v 2 \
    -crf 16 -b:v 0 -deadline good -cpu-used 1 -row-mt 1 "${COR[@]}" -pass 1 -passlogfile "entrega/.vp9-$formato" -an -f null /dev/null
  ffmpeg -v error -y "${ENTRADA[@]}" -vf "$YUV16,format=yuv420p10le" -c:v libvpx-vp9 -profile:v 2 \
    -crf 16 -b:v 0 -deadline good -cpu-used 1 -row-mt 1 "${COR[@]}" -pass 2 -passlogfile "entrega/.vp9-$formato" -an "$BASE.webm"

  # 2) HEVC Main10 (Safari no Mac e no iPhone), com a etiqueta hvc1 que o Safari exige.
  ffmpeg -v error -y "${ENTRADA[@]}" -vf "$YUV16,format=yuv420p10le" -c:v libx265 -preset slow -crf 14 \
    -x265-params "log-level=error:aq-mode=3:no-sao=1" -tag:v hvc1 "${COR[@]}" -movflags +faststart -an "$BASE-hevc.mp4"

  # 3) H.264 8 bits, reserva universal (com pontilhado preservado pelo tune grain).
  ffmpeg -v error -y "${ENTRADA[@]}" -vf "$YUV16,format=yuv420p" -c:v libx264 -preset veryslow -tune grain \
    -crf 12 -profile:v high -level 4.2 "${COR[@]}" -movflags +faststart -an "$BASE-h264.mp4"

  # Master 100% sem perdas (RGB, idêntico aos quadros renderizados), para editar ou recodificar depois.
  ffmpeg -v error -y "${ENTRADA[@]}" -c:v libx264rgb -preset veryslow -qp 0 -an "$BASE-master-sem-perdas.mkv"

  # Pôster sem perdas: o primeiro quadro (só o fundo, com o mesmo pontilhado), para não piscar.
  ffmpeg -v error -y -i "$formato/renders/master-png/frame_000001.png" -c:v libwebp -lossless 1 -compression_level 6 "$BASE-poster.webp"
done
rm -f entrega/.vp9-*
ls -la entrega
