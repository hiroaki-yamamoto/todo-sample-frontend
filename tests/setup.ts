import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { afterEach } from "bun:test";
import '@testing-library/jest-dom';

GlobalRegistrator.register();

afterEach(() => {
  if (globalThis.document) {
    document.body.innerHTML = '';
  }
});
