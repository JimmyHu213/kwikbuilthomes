import * as migration_20260611_033022_initial from './20260611_033022_initial';

export const migrations = [
  {
    up: migration_20260611_033022_initial.up,
    down: migration_20260611_033022_initial.down,
    name: '20260611_033022_initial'
  },
];
