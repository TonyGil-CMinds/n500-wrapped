'use client'

import { useEffect, useState } from 'react'

/**
 * howler expone su singleton en `window.Howler` una vez cargado. Lo leemos de
 * ahí en lugar de importar el paquete para no arrastrarlo al render del
 * servidor: use-sound lo carga de forma diferida en el cliente.
 */
function getHowler() {
  return typeof window === 'undefined' ? undefined : window.Howler
}

/**
 * Indica si el AudioContext está realmente activo.
 *
 * Importa porque howler ENCOLA las reproducciones lanzadas con el contexto
 * suspendido y las vuelca todas juntas al desbloquearse. Si no se espera a
 * esto, el primer clic del usuario dispara de golpe todo lo que se intentó
 * reproducir antes. Con este gate, nada se reproduce —ni se encola— hasta que
 * hay un gesto real del usuario.
 */
export function useAudioReady() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (ready) return

    const isRunning = () => {
      const H = getHowler()
      if (!H || !H._howls) return false // howler aún no ha cargado
      if (!H.usingWebAudio) return true // modo HTML5: no hay contexto que desbloquear
      return H.ctx?.state === 'running'
    }

    const settle = () => {
      if (isRunning()) setReady(true)
    }

    const unlock = () => {
      getHowler()?.ctx?.resume?.().catch(() => {})
      // resume() resuelve de forma asíncrona; damos un respiro antes de mirar.
      setTimeout(settle, 60)
    }

    settle()

    // En captura y sobre pointerdown: así el resume() arranca lo antes posible
    // dentro del gesto, y para cuando llegue el click del botón el contexto
    // suele estar ya activo y ese primer efecto también se oye.
    const events = ['pointerdown', 'keydown', 'touchend']
    events.forEach((e) => window.addEventListener(e, unlock, { capture: true }))
    // El gesto puede llegar antes de que howler termine de cargar.
    const poll = setInterval(settle, 300)

    return () => {
      events.forEach((e) => window.removeEventListener(e, unlock, { capture: true }))
      clearInterval(poll)
    }
  }, [ready])

  return ready
}
