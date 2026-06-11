import * as migration_20260611_040147_initial from './20260611_040147_initial';

export const migrations = [
  {
    up: migration_20260611_040147_initial.up,
    down: migration_20260611_040147_initial.down,
    name: '20260611_040147_initial'
  },
];
