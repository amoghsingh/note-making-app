// forge.config.js
import { VitePlugin } from '@electron-forge/plugin-vite';

export default {
  packagerConfig: {
    asar: false
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main/main.js',   // main process entry
          config: 'vite.main.config.mjs',
        },
        {
          entry: 'src/preload/preload.js', // preload script
          config: 'vite.preload.config.mjs',
        },
      ],
      renderer: [
        {
          name: 'main_window', // matches the HTML window name
          config: 'vite.renderer.config.mjs',
        },
      ],
    }),
  ],
};
