// Temporary global module declarations to allow the project to typecheck
// without installed node_modules. These should be removed once dependencies
// are installed via `npm install` / `bun install` / `pnpm install`.

declare module '@tanstack/react-query' {
  // Minimal exports used in the app
  export const QueryClient: any;
  export const QueryClientProvider: any;
}

declare module 'react-router-dom' {
  // Provide any-typed React Router exports used by the app
  import * as React from 'react';
  export const BrowserRouter: React.ComponentType<any>;
  export const Routes: React.ComponentType<any>;
  export const Route: React.ComponentType<any>;
}

// JSX runtime - React 17/18 automatic runtime types
declare module 'react/jsx-runtime' {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function jsxDEV(type: any, props: any, key?: any): any;
}

// Generic wildcard to silence any other absolute alias imports (e.g. @/components/...)
declare module '\@/*';
