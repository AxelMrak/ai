# 🤖 Sistema de Agentes AI para Desarrollo

¿Te pasa que cada vez que hablas con una IA para programar, terminás explicando las mismas reglas una y otra vez? ¿O que el código que genera no sigue tus estándares? Este repo soluciona eso creando un "contrato" claro entre vos y tu asistente de IA.

## ¿Qué Problema Resuelve?

Las IAs son geniales, pero pierden el contexto fácilmente. Terminás peleando con el mismo código espagueti o explicando por qué no usás `any` en TypeScript. Este sistema crea reglas claras y memoria persistente para que cada conversación sea productiva desde el minuto cero.

## Inicio Rápido

### 1. Cloná el Repo
```bash
git clone https://github.com/tu-repo/ai-agents-system.git
cd ai-agents-system
```

### 2. Instalá Dependencias
```bash
bun install  # o npm install
```

### 3. Configurá en tu Proyecto
Copiá estos archivos a `~/Developer/ai/` (o donde prefieras):
- `MANIFESTO.md` - Tus reglas técnicas
- `AGENTS.md` - Los personajes de IA
- `skills/` - Reglas específicas por tecnología

### 4. Usalo en un Proyecto Nuevo
En cualquier proyecto, creá una carpeta `.ai/` y copiá los templates:
```bash
mkdir .ai
cp ~/Developer/ai/templates/* .ai/
```

¡Listo! Ahora tu IA sabe exactamente cómo trabajar.

## Cómo Funcionan los Agentes

Imaginá que tenés un equipo de desarrollo:

```
Usuario pregunta algo ──┬── "¿Cómo debería ser?" ── ATHENA (Arquitecta)
                        ├── "¿Cómo lo implemento?" ── APOLLO (Desarrollador)
                        └── "¿Por qué se rompió?" ── HEFESTO (Debugger)
```

### 🏛️ ATHENA - La Arquitecta
Es la "jefa" estricta. Planea todo antes de codificar.
- **Hace:** Diagramas, estrategias, opciones con pros/contras
- **No hace:** Código final (eso lo delega)
- **Frase típica:** "Esto no escala, loco"

### 🎼 APOLLO - El Artesano
El que pone las manos en la masa. Implementa limpio y simétrico.
- **Hace:** Código impecable, tests, commits
- **No hace:** Planes complejos (pide ayuda a ATHENA)
- **Frase típica:** "Quedó una pinturita"

### 🔥 HEFESTO - El Herrero
Arregla lo roto. Busca la raíz de los bugs.
- **Hace:** Debuggear, revisar calidad, aprobar para prod
- **No hace:** Cambios grandes sin planear
- **Frase típica:** "Vamos por partes"

## El Sistema de Memoria (.ai/)

Cada proyecto tiene su propia "memoria" en la carpeta `.ai/`:

```
.ai/
├── CONTEXT.md     # "Esto es el proyecto" - stack, estructura, reglas
├── MEMORY.md      # "Dónde estamos" - foco actual, decisiones recientes
├── TO-DO.md       # "Qué falta" - tareas pendientes
├── plans/         # "Planes detallados" - para features complejas
└── notes/         # "Aprendizajes" - bugs encontrados, lecciones
```

**Analogía:** Es como si cada proyecto tuviera su propio diario. Cuando retomás después de días, sabés exactamente por dónde seguís.

### Ejemplo Práctico
Si estás trabajando en una app de e-commerce:

- **CONTEXT.md:** "Usamos Next.js, Tailwind, PostgreSQL. Componentes en `/components/`"
- **MEMORY.md:** "Estamos agregando el carrito de compras. Última decisión: usar Zustand para state"
- **TO-DO.md:** `[ ] Agregar API de pagos`, `[x] Diseño del carrito`

## Las Skills (Habilidades Especiales)

Son reglas específicas para tecnologías. Como "recetas" probadas.

```
skills/
├── react/         # Cómo escribir React limpio
├── python/        # Patrones de Python
└── _scripts/      # Para sincronizar skills externas
```

**Ejemplo:** La skill de React dice "siempre usar hooks custom para lógica reutilizable" o "nunca pasar funciones inline a componentes".

## El Manifesto - Tus Principios Técnicos

Es la "constitución" del código. Reglas no-negociables:

### Arquitectura
- **Capas claras:** Domain (lógica), Application (casos de uso), Infrastructure (bases de datos)
- **No monitos gordos:** Nada de funciones con 200 líneas
- **Imports absolutos:** `@/components/Button`, no `../../Button`

### Código Limpio
- **Sin `any`:** Usa `unknown` y type guards
- **Self-documenting:** El código explica qué hace sin comentarios
- **Inglés en código:** Variables, funciones, commits en inglés

### Proceso
- **Blueprint primero:** Arquitectura antes de codear
- **Tests reales:** No `assert true`, cubrí casos reales
- **Aprobación explícita:** Nada se ejecuta sin "dale"

## Estructura del Proyecto

```
ai/
├── MANIFESTO.md          # Las reglas fundamentales
├── AGENTS.md             # Los 3 personajes de IA
├── README.md             # Este archivo
├── scripts/
│   ├── sync-opencode.ts  # Conectar con OpenCode
│   └── inject.sh         # Pegar contexto en prompts
├── skills/               # Reglas por tecnología
│   ├── react/
│   └── python/
└── templates/            # Para copiar a nuevos proyectos
    └── TO-DO.md
```

## Ejemplos de Uso

### Nuevo Proyecto
```bash
# 1. Creá la carpeta de memoria
mkdir .ai

# 2. Copiá templates
cp ~/Developer/ai/templates/* .ai/

# 3. Editá CONTEXT.md con tu stack
# Editá MEMORY.md con el foco actual
```

### Agregar una Feature
1. **ATHENA:** "¿Cómo debería ser el login?"
2. **APOLLO:** Implementa según el plan
3. **HEFESTO:** Revisa que no haya bugs

### Resolver un Bug
1. **HEFESTO:** "¿Por qué se rompió?"
2. **APOLLO:** Arregla el código
3. **ATHENA:** Si es un problema de arquitectura, replanea

## ¿Por Qué Funciona?

- **Memoria persistente:** No repetís explicaciones
- **Roles claros:** Cada agente sabe qué hacer
- **Reglas explícitas:** Menos "vibe coding", más decisiones técnicas
- **Escalable:** Funciona en proyectos chicos y grandes

## Preguntas Frecuentes

**¿Es solo para TypeScript?** No, funciona con cualquier lenguaje. Las skills son por tecnología.

**¿Necesito todos los agentes?** No, podés usar solo ATHENA para planning o APOLLO para coding.

**¿Qué pasa si cambio de IA?** Copiá los archivos .ai/ y listo - el contexto viaja con vos.

**¿Es mucho setup?** Para el primer proyecto sí, pero después es copiar-pegar.

## Filosofía

Vos sos el arquitecto, la IA es el senior developer que ejecuta tu visión. Esto no automatiza el pensamiento, crea un framework donde el pensamiento es explícito, documentado y reutilizable.

Si te sirve, usalo. Si no, adaptalo. El código es tuyo.

---

*Hecho con ❤️ para desarrolladores que piensan antes de codear*