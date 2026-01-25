# REMOTION-BEST-PRACTICES - TAILWIND.MD
> Generated: 2026-01-25
> Rules: 1


### RULE: tailwind
(File: tailwind.md)

You can and should use TailwindCSS in Remotion, if TailwindCSS is installed in the project.

Don't use `transition-*` or `animate-*` classes - always animate using the `useCurrentFrame()` hook.  

Tailwind must be installed and enabled first in a Remotion project - fetch  https://www.remotion.dev/docs/tailwind using WebFetch for instructions.
