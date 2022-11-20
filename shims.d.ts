declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

type CustomMatchers<R = unknown> = TestingLibraryMatchers<typeof expect.stringContaining, R>;

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}