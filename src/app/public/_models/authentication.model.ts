export class Authentication {
  isAuthenticated!: boolean;
  bearerToken!: string | null;
  usernameFromJwt!: string | null;
}