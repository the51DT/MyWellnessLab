import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) =>
  {
    // 환경변수 로드
    const env = loadEnv(mode, process.cwd(), '')
    
    let config = null;

    if(mode === "development"){
      config = {
        plugins: [
          vue()
          , mkcert({
            // SSL 키 등록
            keyFile: "/localCert/mywellnesslab.dev.amway.co.kr.pem",
            certFile: "/localCert/mywellnesslab.dev.amway.co.kr-key.pem"
          })
        ],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@public': fileURLToPath(new URL('./public', import.meta.url)),
            '@aws-sdk/credential-providers': fileURLToPath(
              new URL('./node_modules/@aws-sdk/credential-providers/dist-es/index.browser.js', import.meta.url)
            )
          },
          conditions: ['browser', 'module', 'import', 'default']
        },
        optimizeDeps: {
          esbuildOptions: {
            mainFields: ['browser', 'module']
          }
        },
        server: {
          port: 443
        }
      }
    } else {
      config = {
        plugins: [
          vue()
        ],
        resolve: {
          alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
          }
        }
      }
    }

    return config;
  }
)
