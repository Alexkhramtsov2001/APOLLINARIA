export interface PortfolioConfig {
  readonly debug: boolean;
  readonly performance: {
    readonly mobileBreakpoint: number;
    readonly tabletBreakpoint: number;
  };
  readonly animation: {
    readonly revealThreshold: number;
    readonly glitchMinDelay: number;
    readonly glitchMaxDelay: number;
  };
  readonly canvas: {
    readonly desktopParticles: number;
    readonly tabletParticles: number;
    readonly mobileParticles: number;
    readonly desktopFps: number;
    readonly tabletFps: number;
    readonly mobileFps: number;
    readonly desktopDpr: number;
    readonly tabletDpr: number;
    readonly mobileDpr: number;
  };
  readonly storage: {
    readonly language: string;
    readonly palette: string;
  };
}

export const CONFIG: Readonly<PortfolioConfig> = Object.freeze({
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
