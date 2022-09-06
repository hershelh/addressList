import { defineConfig } from 'cypress'
import axios from 'axios'
import codeCoverageTask from '@cypress/code-coverage/task'

const config = defineConfig({
  env: {
    apiUrl: 'http://localhost:5001/',
    user: {
      username: 'jeanmay',
      password: 'password123456',
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3333/',
    specPattern: 'cypress/e2e/**/*.spec.ts',
    viewportHeight: 812,
    viewportWidth: 375,
    setupNodeEvents(on) {
      on('task', {
        'db:seed': async function () {
          const { data } = await axios.post(`${config.env?.apiUrl}test/seed`)
          return data
        },
      })

      codeCoverageTask(on, config)
      return config
    },
  },
})

export default config
