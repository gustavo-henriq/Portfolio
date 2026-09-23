# Newspaper motion

GSAP 3.15 + @gsap/react 2.1 were approved by the owner. ScrollTrigger and MotionPathPlugin are included in GSAP's current free standard license, including commercial websites. No smooth-scroll or interaction library is used. Geometry along the trajectory is sampled with SVG `getPointAtLength`, shared with the milestone positions.

Native document scroll remains in charge. The longer visual stories pin only their own compact stage when reached: JobHunter's funnel, the solved stack grid and the trajectory route. Scroll progress advances the scene and releases it immediately at completion; input is never literally blocked. The recursive portfolio preview is deliberately static. Main content never starts hidden. Production `npm run build` prerenders readable HTML (including the solved puzzle) before adding JavaScript. The existing portrait interaction and contact skyline are untouched.

## Modules and test checklist

| Effect | Files | Test |
|---|---|---|
| A progress/folio | ScrollChrome.jsx, animations.css | Scroll through the four sections; progress grows and folio updates. |
| B compact masthead | ScrollChrome.jsx | Scroll 200px; index, theme and language controls remain accessible; Tab focus and anchors stay below the bar. |
| C highlights | Highlight.jsx, animations.css | Key words paint on entry in supporting browsers. CSS fallback is fully painted; text is always readable. Clip-path is used instead of background-size to avoid paint/layout animation. |
| D numbers | CountUp.jsx | Scroll to 600+ and 82%; fast anchor jumps leave final values. Screen readers get final labels; widths are reserved. |
| G trajectory | Trajectory.jsx | On arrival the route stage pins; scroll forward/back to draw the route, plane, pins and tickets, then release. Mobile uses a shorter vertical stage. |
| F puzzle | capsules.js, WordSearch.jsx | Default solved; the grid pins on arrival while the ten capsules draw, then releases. PLAY and finding a skill reuse drawCapsule. All skills read left-to-right. |
| E JobHunter | Funnel.jsx | The compact funnel pins on arrival while 24 slips filter into three, then releases with a localized illustrative notification. |
| H portfolio preview | App.jsx | Plain static screenshot. No recursive layers, animation, iframe, pinning or scroll consumption. |
| I FOUND | FoundPoster.jsx | Enter contact: stamp lands on compact poster; text/form and skyline remain readable. |

For **each row**, test 390px and desktop, PT/EN/ES, both themes, and OS/browser reduced motion. Reduced motion removes tweens/pinning and shows complete static states. GSAP contexts and matchMedia revert on changes/unmount. Refresh runs after fonts, images and language/theme changes. Add `?debug=anim` before the hash to see ScrollTrigger markers.

For a repeatable static-mode QA check, `?motion=reduce` forces the same reduced-motion branch without changing OS settings. The default still follows the OS preference. Run `npm run build` before `node --test tests/*.test.mjs` (the static HTML test inspects the exported build).

No 60fps/4x-CPU result is claimed without a real performance recording. No persistent will-change is used. Static paper/image filters are not animated.

## Tunables (`config.js`)

| Setting | Default | Meaning |
|---|---|---|
| headerScroll | 200 | Scroll pixels before compact header |
| headerScale | .82 | Main title end scale |
| countDuration / countStagger | 1.2 / .12 | Seconds for counters and same-card staggering |
| onceStart | top 85% | Counter entry trigger |
| capsuleDuration / capsuleStagger | .55 / .15 | Seconds for outlines and ordering |
| trajectoryScrub / trajectoryScrollVh | .6 / 135 | Route catch-up and pinned scroll distance |
| stampDuration / stampEase | .25 / back.out(1.5) | FOUND duration / route ticket easing |
| funnelScrollVh | 80 | Pinned funnel scroll distance |
| funnelSlips | 24 | Number of animated listings |
| desktopMin | 1024 | Pin/desktop route breakpoint |
| foundStart | center 75% | Contact stamp entry |

CSS tunables: compact bar ~70px (82px mobile), anchor offset 100px, progress height 3px, highlight range entry10%–cover40%, route stage 510px/900px. Colors inherit site variables.

## Real destinations

`src/links.js` copies published URLs from `gustavo-henriq/Portfolio` at main commit b384e49. Contact opens a mailto draft (does not silently send). CV is a local copy of its published PDF. LinkedIn is not declared in the source and remains a documented TODO, not a guessed URL. The current UI shows email in its place.
