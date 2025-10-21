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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Minimal React module declarations to avoid TS errors when @types/react isn't installed.
declare module 'react' {
  export type ReactNode = any;
  export function useEffect(effect: (...args: any[]) => any, deps?: any[]): void;
  const React: any;
  export default React;
}
