/**
 * Tarjetas de empresas de la red que giran en la rueda.
 *
 * La primera es la destacada: su nombre lo sobrescribe el de la empresa
 * destinataria, así que estos valores sólo se ven en la previsualización.
 *
 * OJO: salvo Litro de Luz, los datos son de relleno para poder montar la
 * animación. Hay que sustituirlos por los reales antes de publicar.
 */
export const cards = [
  {
    id: 'litro-de-luz',
    name: 'Litro de Luz',
    country: 'Perú',
    flag: '/flags/pe.svg',
    image: '/litrodeluz-image.png',
    category: 'Desiertos Costeros',
    meta: ['2017', 'Líder', 'Verde'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    country: 'Chile',
    flag: '/flags/cl.svg',
    image: '/Ocean-image.png',
    category: 'Costa Pacífica',
    meta: ['2019', 'Aliada', 'Azul'],
  },
  {
    id: 'regavni',
    name: 'Regavni',
    country: 'Colombia',
    flag: '/flags/co.svg',
    image: '/regavni-image.png',
    category: 'Bosque Andino',
    meta: ['2021', 'Semilla', 'Verde'],
  },
  {
    id: 'altiplano',
    name: 'Altiplano',
    country: 'Bolivia',
    flag: '/flags/bo.svg',
    image: '/blur-image.png',
    category: 'Valles Interandinos',
    meta: ['2020', 'Aliada', 'Verde'],
  },
]
