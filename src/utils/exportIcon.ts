import { SIZE } from '@/composables/usePixelGrid'

export function toPngBlob(pixels: boolean[]): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, SIZE, SIZE)
  ctx.fillStyle = '#000'
  pixels.forEach((on, i) => {
    if (on) ctx.fillRect(i % SIZE, Math.floor(i / SIZE), 1, 1)
  })
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))),
      'image/png',
    ),
  )
}

export function toSvgString(pixels: boolean[]): string {
  const path = pixels
    .map((on, i) => (on ? `M${i % SIZE} ${Math.floor(i / SIZE)}h1v1h-1z` : ''))
    .join('')
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" shape-rendering="crispEdges">`,
    `<rect width="${SIZE}" height="${SIZE}" fill="#fff"/>`,
    path ? `<path d="${path}" fill="#000"/>` : '',
    '</svg>',
  ].join('')
}

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export async function exportPng(pixels: boolean[]) {
  download(await toPngBlob(pixels), 'icon.png')
}

export function exportSvg(pixels: boolean[]) {
  download(new Blob([toSvgString(pixels)], { type: 'image/svg+xml' }), 'icon.svg')
}
