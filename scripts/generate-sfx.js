// Genera los SFX de interfaz como WAV PCM 16-bit mono 44.1kHz.
const fs = require('fs')
const path = require('path')

const RATE = 44100
const OUT = process.argv[2]

function wav(samples) {
  const data = Buffer.alloc(samples.length * 2)
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]))
    data.writeInt16LE(Math.round(v * 32767), i * 2)
  }
  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + data.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20) // PCM
  header.writeUInt16LE(1, 22) // mono
  header.writeUInt32LE(RATE, 24)
  header.writeUInt32LE(RATE * 2, 28)
  header.writeUInt16LE(2, 32)
  header.writeUInt16LE(16, 34)
  header.write('data', 36)
  header.writeUInt32LE(data.length, 40)
  return Buffer.concat([header, data])
}

const n = (sec) => Math.floor(sec * RATE)
const env = (i, len, attack, decay) => {
  const t = i / len
  const a = attack / (len / RATE)
  if (t < a) return t / a
  return Math.pow(1 - (t - a) / (1 - a), decay)
}

// Ruido rosa aproximado (Voss simplificado) para texturas suaves.
function pinkNoise(len, seed = 1) {
  let s = seed
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return (s / 0x7fffffff) * 2 - 1
  }
  const out = new Float32Array(len)
  let b0 = 0, b1 = 0, b2 = 0
  for (let i = 0; i < len; i++) {
    const w = rnd()
    b0 = 0.99765 * b0 + w * 0.099
    b1 = 0.963 * b1 + w * 0.2965
    b2 = 0.57 * b2 + w * 1.0526
    out[i] = (b0 + b1 + b2 + w * 0.1848) * 0.25
  }
  return out
}

// click: golpe corto y seco, con cuerpo grave.
function click() {
  const len = n(0.09)
  const noise = pinkNoise(len, 7)
  const out = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    const t = i / RATE
    const body = Math.sin(2 * Math.PI * 640 * t) * Math.exp(-t * 90)
    const snap = noise[i] * Math.exp(-t * 160)
    out[i] = (body * 0.55 + snap * 0.5) * env(i, len, 0.001, 1.4) * 0.5
  }
  return out
}

// hover: tick muy tenue y agudo.
function hover() {
  const len = n(0.05)
  const out = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    const t = i / RATE
    out[i] = Math.sin(2 * Math.PI * 1750 * t) * Math.exp(-t * 190) * 0.13
  }
  return out
}

// whoosh: barrido de ruido para las transiciones entre slides.
function whoosh() {
  const len = n(0.42)
  const noise = pinkNoise(len, 23)
  const out = new Float32Array(len)
  let lp = 0
  for (let i = 0; i < len; i++) {
    const t = i / len
    // Filtro paso-bajo de un polo con corte móvil: sube y vuelve a bajar.
    const cut = 0.03 + 0.5 * Math.sin(Math.PI * t)
    lp += cut * (noise[i] - lp)
    out[i] = lp * Math.sin(Math.PI * t) * 0.42
  }
  return out
}

// tick: paso del odómetro, muy corto.
function tick() {
  const len = n(0.035)
  const out = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    const t = i / RATE
    out[i] = Math.sin(2 * Math.PI * 2100 * t) * Math.exp(-t * 320) * 0.16
  }
  return out
}

// reveal: acorde ascendente para el momento de la selección.
function reveal() {
  const len = n(1.5)
  const out = new Float32Array(len)
  // Lab menor-ish: notas que entran escalonadas.
  const notes = [
    { f: 329.63, at: 0.0 },
    { f: 493.88, at: 0.13 },
    { f: 659.25, at: 0.26 },
    { f: 987.77, at: 0.42 },
  ]
  for (const note of notes) {
    const start = n(note.at)
    for (let i = start; i < len; i++) {
      const t = (i - start) / RATE
      const a = Math.exp(-t * 2.4) * (1 - Math.exp(-t * 60))
      out[i] +=
        (Math.sin(2 * Math.PI * note.f * t) * 0.5 +
          Math.sin(2 * Math.PI * note.f * 2 * t) * 0.12) *
        a *
        0.17
    }
  }
  return out
}

const files = { click, hover, whoosh, tick, reveal }
fs.mkdirSync(OUT, { recursive: true })
for (const [name, fn] of Object.entries(files)) {
  const buf = wav(fn())
  fs.writeFileSync(path.join(OUT, `${name}.wav`), buf)
  console.log(name.padEnd(8), (buf.length / 1024).toFixed(1) + ' KB')
}
