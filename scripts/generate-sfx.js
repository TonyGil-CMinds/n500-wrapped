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

/** Ruido blanco determinista: más brillante que el rosa, para impactos. */
function whiteNoise(len, seed = 1) {
  let s = seed
  const out = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    out[i] = (s / 0x7fffffff) * 2 - 1
  }
  return out
}

/** Coeficiente de un paso-bajo de un polo, dada la frecuencia de corte. */
const lpCoef = (hz) => 1 - Math.exp((-2 * Math.PI * hz) / RATE)

/**
 * Modo resonante: la respuesta al impulso de una cavidad que suena a `hz` y se
 * apaga en `tau` segundos. Sumando varios se imita el cuerpo de la palma.
 */
function mode(out, hz, tau, amp, startSample = 0) {
  for (let i = startSample; i < out.length; i++) {
    const t = (i - startSample) / RATE
    if (t > tau * 6) break
    out[i] += Math.sin(2 * Math.PI * hz * t) * Math.exp(-t / tau) * amp
  }
}

/**
 * click: una nota suave, no un golpe.
 *
 * El objetivo es que no compita con la música sino que forme parte de ella.
 * Analizando `the-start-of-a-startup.wav` salen F, A y C como clases de altura
 * dominantes —la tríada de fa mayor—, así que la nota es un DO (C6, la quinta
 * de la tonalidad): consonante sobre casi cualquier acorde de la pieza.
 *
 * No lleva transitorio de ruido. Un ataque instantáneo es justo lo que hace
 * que un sonido "pinche" por encima de la mezcla en vez de fundirse con ella.
 */
function click() {
  const len = n(0.9)
  const out = new Float32Array(len)

  const C6 = 1046.5
  const dryLen = n(0.4)
  const dry = new Float32Array(dryLen)

  for (let i = 0; i < dryLen; i++) {
    const t = i / RATE
    // Ataque de 3 ms: entra en rampa, sin borde.
    const attack = 1 - Math.exp(-t / 0.003)
    const fundamental = Math.sin(2 * Math.PI * C6 * t) * Math.exp(-t / 0.085)
    // Una octava por encima, muy floja y más corta: brillo sin filo.
    const shimmer = Math.sin(2 * Math.PI * C6 * 2 * t) * Math.exp(-t / 0.035) * 0.18
    // Y la quinta por debajo (F5), aún más floja, para dar cuerpo.
    const body = Math.sin(2 * Math.PI * 698.46 * t) * Math.exp(-t / 0.06) * 0.22
    dry[i] = (fundamental + shimmer + body) * attack
  }

  normalize(dry, 1)

  for (let i = 0; i < dryLen; i++) out[i] += dry[i]

  // Un resto de sala, corto y muy por detrás: sitúa el sonido sin llamar la
  // atención.
  const ir = churchIR(0.55)
  const WET = 0.14
  for (let i = 0; i < dryLen; i++) {
    const d = dry[i] * WET
    if (d === 0) continue
    for (let j = 0; j < ir.length && i + j < len; j++) out[i + j] += d * ir[j]
  }

  return normalize(out, 0.72)
}

/**
 * Respuesta al impulso de una nave de piedra.
 *
 *  - Un pre-delay largo: en un espacio grande la primera reflexión tarda.
 *  - Reflexiones tempranas dispersas, de los muros y la bóveda.
 *  - Cola densa de ruido que decae, con el corte del paso-bajo cerrándose:
 *    la piedra absorbe los agudos mucho antes que los graves, y sin eso la
 *    cola suena a siseo blanco en vez de a reverberación.
 */
function churchIR(seconds) {
  const len = n(seconds)
  const ir = new Float32Array(len)
  const noise = whiteNoise(len, 8123)

  // Reflexiones tempranas: [retardo en s, ganancia]
  const early = [
    [0.028, 0.5],
    [0.041, 0.4],
    [0.057, 0.34],
    [0.073, 0.3],
    [0.091, 0.26],
    [0.114, 0.22],
    [0.138, 0.18],
  ]
  for (const [delay, gain] of early) ir[n(delay)] += gain

  const preDelay = n(0.03)
  const tau = seconds / 6.91 // RT60 ≈ la duración pedida
  let lp = 0
  for (let i = preDelay; i < len; i++) {
    const t = (i - preDelay) / RATE
    // El corte baja de 8 kHz a ~600 Hz conforme se apaga la cola.
    lp += lpCoef(600 + 7400 * Math.exp(-t / 0.55)) * (noise[i] - lp)
    // Los primeros 40 ms suben en rampa: la difusión tarda en formarse.
    const build = Math.min(1, t / 0.04)
    ir[i] += lp * Math.exp(-t / tau) * build * 0.55
  }

  return ir
}

/** Escala la señal para que su pico quede en `peak`. */
function normalize(samples, peak) {
  let max = 0
  for (const v of samples) max = Math.max(max, Math.abs(v))
  if (max === 0) return samples
  const g = peak / max
  for (let i = 0; i < samples.length; i++) samples[i] *= g
  return samples
}

/**
 * card: el tic de cada tarjeta al pasar por delante en la rueda.
 *
 * Suena muchas veces seguidas mientras la rueda gira, así que tiene que ser
 * discreto: un golpecito de madera, corto y sin brillo. La nota es un LA
 * (A5), tercera de fa mayor, para que encaje con la música.
 */
function card() {
  const len = n(0.09)
  const out = new Float32Array(len)
  const noise = whiteNoise(len, 3307)
  const c = lpCoef(1400)
  let a = 0
  let b = 0
  for (let i = 0; i < len; i++) {
    const t = i / RATE
    a += c * (noise[i] - a)
    b += c * (a - b)
    out[i] = b * Math.exp(-t / 0.004) * 4
  }
  mode(out, 880, 0.012, 0.5)
  mode(out, 1320, 0.006, 0.14)
  return normalize(out, 0.5)
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

const files = { click, hover, whoosh, tick, reveal, card }
fs.mkdirSync(OUT, { recursive: true })
for (const [name, fn] of Object.entries(files)) {
  const buf = wav(fn())
  fs.writeFileSync(path.join(OUT, `${name}.wav`), buf)
  console.log(name.padEnd(8), (buf.length / 1024).toFixed(1) + ' KB')
}
