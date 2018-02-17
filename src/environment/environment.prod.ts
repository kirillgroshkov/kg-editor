export class EnvironmentProd {
  name = 'prod'
  prod = true
  dev = false

  apiUrl = 'https://kg-backend.now.sh/editor'
}

export type Environment = EnvironmentProd

export default new EnvironmentProd()
