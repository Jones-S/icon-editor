export function drawPixels(ctx: CanvasRenderingContext2D, pixels: boolean[], size: number) {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#000'
  pixels.forEach((on, i) => {
    if (on) ctx.fillRect(i % size, Math.floor(i / size), 1, 1)
  })
}

export function toPngBlob(pixels: boolean[], size: number): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  drawPixels(canvas.getContext('2d')!, pixels, size)
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))),
      'image/png',
    ),
  )
}

export function toSvgString(pixels: boolean[], size: number): string {
  const path = pixels
    .map((on, i) => (on ? `M${i % size} ${Math.floor(i / size)}h1v1h-1z` : ''))
    .join('')
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges">`,
    `<rect width="${size}" height="${size}" fill="#fff"/>`,
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

export async function exportPng(pixels: boolean[], size: number) {
  download(await toPngBlob(pixels, size), `icon-${size}.png`)
}

export function exportSvg(pixels: boolean[], size: number) {
  download(new Blob([toSvgString(pixels, size)], { type: 'image/svg+xml' }), `icon-${size}.svg`)
}
