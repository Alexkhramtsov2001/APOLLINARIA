export const CONFIG = Object.freeze({
    debug: false,
    performance: { mobileBreakpoint: 760, tabletBreakpoint: 1000 },
    animation: { revealThreshold: 0.14, glitchMinDelay: 4200, glitchMaxDelay: 8500 },
    canvas: {
        desktopParticles: 60,
        tabletParticles: 35,
        mobileParticles: 22,
        desktopFps: 60,
        tabletFps: 45,
        mobileFps: 30,
        desktopDpr: 2,
        tabletDpr: 1.5,
        mobileDpr: 1,
    },
    storage: { language: 'portfolio-language', palette: 'portfolio-palette' },
});
