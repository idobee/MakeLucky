// Minimal type declarations to satisfy TS in this lightweight setup.
// If @types/react is added later, these can be removed.

declare module 'react/jsx-runtime' {
  export const Fragment: any;
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

interface ImportMetaEnv {
  readonly MODE: string;
  readonly VITE_GOOGLE_ADSENSE_CLIENT_ID?: string;
  readonly VITE_GOOGLE_ADSENSE_SLOT_ID?: string;
  readonly VITE_GOOGLE_ADSENSE_FLAG?: string;
  readonly VITE_ROLLING_INTERVAL_MS?: string;
  readonly VITE_ROLLING_FADE_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Minimal React module declarations to avoid TS errors when @types/react isn't installed.
declare module 'react' {
  export type ReactNode = any;
  export interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode }): any;
  }
  export type FC<P = {}> = FunctionComponent<P>;
  export function useState<S = any>(
    initial?: S | (() => S)
  ): [S, (value: S | ((prev: S) => S)) => void];
  export function useEffect(effect: (...args: any[]) => any, deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
  const React: any;
  export default React;
}

// Provide a minimal React namespace for React.FC, React.ReactNode references
declare namespace React {
  type ReactNode = any;
  interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode }): any;
  }
  type FC<P = {}> = FunctionComponent<P>;
}
