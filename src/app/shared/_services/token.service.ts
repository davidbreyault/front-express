import { Injectable } from '@angular/core';
import { Payload } from '../_models/payload.model';
import { Buffer } from 'buffer';

@Injectable()
export class TokenService {

  private tokenKey: string = 'access_token';

  constructor() { }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(jwt: string): void {
    localStorage.setItem(this.tokenKey, jwt);
  }

  deleteToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private getJwtPayload(): Payload {
    const b64JwtPayload = this.getToken()!.split('.')[1];
    const jwtPayload = Buffer.from(b64JwtPayload, 'base64').toString();
    return JSON.parse(jwtPayload);
  }

  getJwtUsername(): string {
    return this.getJwtPayload()['sub'];
  }

  getJwtExpirationDate(): number {
    return this.getJwtPayload()['exp'];
  }

  isTokenHasExpired(): boolean {
    return this.getJwtExpirationDate() - Date.now() > 0;
  }
}
