import type { Model } from 'mongoose'
import type { HashContract } from '@ioc:Adonis/Core/Hash'
import type { UserProviderContract, ProviderUserContract } from '@ioc:Adonis/Addons/Auth'

/**
 * Shape of the user object returned by the "MongoDbAuthProvider"
 * class. Feel free to change the properties as you want
 */
export type User = {
  id: string
  email: string
  password: string
  rememberMeToken: string | null
}

/**
 * The shape of configuration accepted by the MongoDbAuthProvider.
 * At a bare minimum, it needs a driver property
 */
export type MongoDbAuthProviderConfig = {
  driver: 'mongo'
  uids: string[]
  model: () => Promise<{ default: Model<User> }>
}

/**
 * Provider user works as a bridge between your User provider and
 * the AdonisJS auth module.
 */
class ProviderUser implements ProviderUserContract<User> {
  constructor(public user: User | null, private hash: HashContract) {}

  /**
   * Returns the user id
   */
  public getId() {
    return this.user ? this.user.id : null
  }

  /**
   * Returns the remember me token for the user (if exists)
   */
  public getRememberMeToken() {
    return this.user ? this.user.rememberMeToken : null
  }

  /**
   * Set the remeber me token. Do not run the update query
   * here. Just update the property
   */
  public setRememberMeToken(token: string) {
    if (!this.user) {
      return
    }
    this.user.rememberMeToken = token
  }

  /**
   * Verify the user password
   */
  public async verifyPassword(plainPassword: string) {
    if (!this.user) {
      throw new Error('Cannot verify password for non-existing user')
    }

    return this.hash.verify(this.user.password, plainPassword)
  }
}

/**
 * The User provider implementation to lookup a user for different
 * operations
 */
export class MongoDbAuthProvider implements UserProviderContract<User> {
  constructor(public config: MongoDbAuthProviderConfig, private hash: HashContract) {}

  /**
   * Lazy loading the user model from the config
   */
  private async resolveModel() {
    return (await this.config.model()).default
  }

  /**
   * Return the provider user instance for a mongodb user
   */
  public async getUserFor(user: User | null) {
    return new ProviderUser(user, this.hash)
  }

  /**
   * Update the remember me token
   */
  public async updateRememberMeToken(user: ProviderUser) {
    const User = await this.resolveModel()
    await User.updateOne({ _id: user.getId() }, { rememberMeToken: user.getRememberMeToken() })
  }

  /**
   * Find a user by id
   */
  public async findById(id: string | number) {
    const User = await this.resolveModel()
    const user = await User.findById(id)
    return this.getUserFor(user || null)
  }

  /**
   * Find a user by user id
   */
  public async findByUid(uidValue: string) {
    const User = await this.resolveModel()
    const query = User.findOne()

    this.config.uids.forEach((uid) => {
      query.where(uid).equals(uidValue)
    })

    const user = await query
    return this.getUserFor(user || null)
  }

  /**
   * Find a user by the remember me token
   */
  public async findByRememberMeToken(userId: string | number, token: string) {
    const User = await this.resolveModel()
    const user = await User.findOne()
      .where('_id')
      .equals(userId)
      .where('rememberMeToken')
      .equals(token)

    return this.getUserFor(user || null)
  }
}
