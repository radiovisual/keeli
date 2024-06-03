import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/**/*.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  legalComments: 'inline',
  packages: 'external',
  target: 'node16'
});
