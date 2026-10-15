export function drawPixels(ctx: CanvasRenderingContext2D, pixels: boolean[], size: number) {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#000'
  pixels.forEach((on, i) => {
    if (on) ctx.fillRect(i % size, Math.floor(i / size), 1, 1)
  })
}

// scale 2 gives the @2x file: every pixel becomes a hard-edged 2 × 2 block, never smoothed
export function toPngBlob(pixels: boolean[], size: number, scale = 1): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = size * scale
  canvas.height = size * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)
  drawPixels(ctx, pixels, size)
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

export async function exportPng(pixels: boolean[], size: number, scale = 1) {
  const suffix = scale === 1 ? '' : `@${scale}x`
  download(await toPngBlob(pixels, size, scale), `icon-${size}${suffix}.png`)
}

export function exportSvg(pixels: boolean[], size: number) {
  download(new Blob([toSvgString(pixels, size)], { type: 'image/svg+xml' }), `icon-${size}.svg`)
}

// The icon as a target screen would show it: scaled to `targetPixels` screen pixels.
// Whole-number scales repeat pixels; anything else gets smoothed, like systems and browsers do.
export function renderForScreen(pixels: boolean[], size: number, targetPixels: number) {
  const source = document.createElement('canvas')
  source.width = size
  source.height = size
  drawPixels(source.getContext('2d')!, pixels, size)

  const target = document.createElement('canvas')
  target.width = targetPixels
  target.height = targetPixels
  const ctx = target.getContext('2d')!
  ctx.imageSmoothingEnabled = targetPixels % size !== 0
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source, 0, 0, targetPixels, targetPixels)
  return target
}
