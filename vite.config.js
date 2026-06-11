import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

const sharedResolve = {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '@public': fileURLToPath(new URL('./public', import.meta.url)),
    '@aws-sdk/credential-providers': fileURLToPath(
      new URL('./node_modules/@aws-sdk/credential-providers/dist-es/index.browser.js', import.meta.url)
    )
  },
  conditions: ['browser', 'module', 'import', 'default']
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  loadEnv(mode, rootDir, '')

  if (mode === 'development') {
    return {
      plugins: [
        vue(),
        mkcert({
          keyFile: '/localCert/mywellnesslab.dev.amway.co.kr.pem',
          certFile: '/localCert/mywellnesslab.dev.amway.co.kr-key.pem'
        })
      ],
      resolve: sharedResolve,
      optimizeDeps: {
        esbuildOptions: {
          mainFields: ['browser', 'module']
        }
      },
      server: {
        port: 443
      }
    }
  }

  return {
    plugins: [vue()],
    resolve: sharedResolve,
    build: {
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  }
})
