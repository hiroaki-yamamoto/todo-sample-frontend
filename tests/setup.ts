/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { afterEach, mock } from "bun:test";
import '@testing-library/jest-dom';

GlobalRegistrator.register();

afterEach(() => {
  if (globalThis.document) {
    document.body.innerHTML = '';
  }
});

(globalThis as any).__mockCookieGet = mock();
(globalThis as any).__mockCookieSet = mock();

mock.module("next/headers", () => ({
  cookies: async () => ({
    get: (globalThis as any).__mockCookieGet,
    set: (globalThis as any).__mockCookieSet,
  }),
}));

(globalThis as any).__mockRevalidatePath = mock();
mock.module("next/cache", () => ({
  revalidatePath: (globalThis as any).__mockRevalidatePath,
}));

(globalThis as any).__mockRedirect = mock();
mock.module("next/navigation", () => ({
  redirect: (globalThis as any).__mockRedirect,
}));
