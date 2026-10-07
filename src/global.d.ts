export {};

declare global {
  interface Window {
    __PORTFOLIO_DEBUG__?: boolean;
    __portfolioModulesReady?: boolean;
  }
}
