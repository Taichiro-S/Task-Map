export const LOGIN: string = '/login'
export const SIGNUP: string = '/signup'
export const DASHBOARD: string = '/dashboard'
export const HOME: string = '/'
export const WAITING_FOR_VERIFICATION: string = '/waitingForVerification'
export const RESET_PASSWORD: string = '/resetPassword'
export const FORGOT_PASSWORD: string = '/forgotPassword'

export const PagesWithoutHeader: string[] = [
  LOGIN,
  SIGNUP,
  WAITING_FOR_VERIFICATION,
  RESET_PASSWORD,
  FORGOT_PASSWORD,
]

export const PagesForOnlyGuestUser: string[] = [LOGIN, SIGNUP]
