import { EnvironmentProd } from './environment.prod'

export class EnvironmentDev extends EnvironmentProd {
  name = 'dev'
  prod = false
  dev = true

  loginUrl = 'http://localhost:8000/login'
  apiUrl = 'http://localhost:8000/editor'
}

export default new EnvironmentDev()
