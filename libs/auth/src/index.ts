import { canActivateAuth } from './lib/auth/access.guard'
import { authTokenInterceptor } from './lib/auth/auth.interceptor'
export * from './lib/feature-login/login-page/login-page.component'

export {
  canActivateAuth,
  authTokenInterceptor,
}

export { AuthService } from '@tt/data-access'
export * from './lib/auth/auth.interface'
