/* eslint-disable no-param-reassign */
import type { App, Plugin } from 'vue';

export type TypeWithInstall<T> = T & Plugin;

export const withInstall = <T>(
  main: T,
  install: (_v: App) => void,
): TypeWithInstall<T> => {
  (main as TypeWithInstall<T>).install = (app): void => {
    install(app);
  };
  return main as TypeWithInstall<T>;
};
