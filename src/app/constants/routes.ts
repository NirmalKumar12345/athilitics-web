export class Routes {
  static readonly HOME = '/';
  static readonly LOGIN = '/login';
  static readonly REGISTER = '/register';
  static readonly VERIFY_OTP = '/verify';
  static readonly DASHBOARD = '/dashboard';
  static readonly PROFILE = '/profile';
  static readonly TOURNAMENTS = '/dashboard/tournament';
  static readonly TOURNAMENT_DETAILS = (id: string | number) => `/dashboard/${id}`;
  static readonly ORGANIZERS = '/organizers';
  static readonly ORGANIZER_DETAILS = (id: number) => `/organizers/${id}`;
  static readonly VENUE_VERIFICATION = '/fieldVerification';
}
