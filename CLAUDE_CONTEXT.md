# Contexto para Claude

Este proyecto es un entorno Next.js y debe contener las siguientes dependencias (intentar instalar con `npm install` desde la raíz del proyecto):

- `next`, `react`, `react-dom`
- `gsap`
- `framer-motion`
- `use-sound` (https://www.npmjs.com/package/use-sound)
- `tailwindcss@3.7` junto con `postcss` y `autoprefixer`
- `react-bits` (nombre aproximado; confirmar si se refiere a otro paquete)
- `liquid-glass` (nombre aproximado; confirmar si se refiere a otro paquete)

Notas:
- En este entorno de edición no se encontró `npm` disponible para ejecutar instalaciones automáticamente; por favor ejecuta desde tu máquina local en la raíz del proyecto:

```bash
npm install
# o para instalar paquetes concretos:
npm install gsap framer-motion use-sound tailwindcss@3.7 postcss autoprefixer
# si necesitas paquetes adicionales (ajustar nombres):
npm install react-bits liquid-glass
```

- Después de instalar, inicializa Tailwind si no lo hiciste: `npx tailwindcss@3.7 init -p`.
- Si los paquetes `react-bits` o `liquid-glass` no existen con esos nombres, por favor confirma los nombres exactos y los instalaré o los añadiré a `package.json`.

Archivos creados:
- `package.json` (con dependencias sugeridas)
- `pages/_app.js`, `pages/index.js`
- `styles/globals.css`
- `tailwind.config.cjs`, `postcss.config.cjs`

Instrucciones rápidas para ejecutar el proyecto localmente:

```bash
# desde la raíz del proyecto
npm install
npm run dev
```

Si quieres, puedo:
- Ejecutar las instalaciones aquí si me confirmas que `npm` está disponible y permites correr comandos.
- Corregir o actualizar los nombres de `react-bits` y `liquid-glass` si me das los nombres exactos.
