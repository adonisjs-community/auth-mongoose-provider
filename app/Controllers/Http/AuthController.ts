// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async showLogin({ view }) {
    return view.render('login')
  }

  public async login({ request, response, auth }) {
    await auth.attempt(request.input('uid'), request.input('password'), true)
    response.redirect('/')
  }

  public async logout({ response, auth }) {
    await auth.logout()
    response.redirect('/login')
  }
}
