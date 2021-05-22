import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Auth = this.app.container.resolveBinding('Adonis/Addons/Auth')
    const Hash = this.app.container.resolveBinding('Adonis/Core/Hash')

    /**
     * Our implementation
     */
    const { MongoDbAuthProvider } = await import('./MongoDbAuthProvider')

    Auth.extend('provider', 'mongo', (_, __, config) => {
      return new MongoDbAuthProvider(config, Hash)
    })
  }
}
