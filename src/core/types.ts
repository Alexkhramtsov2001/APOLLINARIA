export type Cleanup = () => void;
export type Language = 'ru' | 'en';
export type Palette = 'cyan' | 'violet' | 'lime';

export interface ScrollState {
  y: number;
  width: number;
  height: number;
}

export interface PortfolioModule {
  destroy?: Cleanup;
}
