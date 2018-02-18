export class EnvironmentProd {
  name = 'prod'
  prod = true
  dev = false

  loginUrl = 'https://kg-backend.now.sh/login'
  apiUrl = 'https://kg-backend.now.sh/editor'
}

export type Environment = EnvironmentProd

export default new EnvironmentProd()
