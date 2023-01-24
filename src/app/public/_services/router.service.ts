import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable()
export class RouterService {

  actualRouteUrl!: string;
  actualRouteUrlSubject: Subject<string> = new Subject<string>();

  constructor(private router: Router) { }

  test(): void {
    console.log(this.router.url)
  }

  setActualRouteUrl(url: string): void {
    this.actualRouteUrl = url;
    this.emitActualRouteUrlSubject();
  }

  private emitActualRouteUrlSubject(): void {
    this.actualRouteUrlSubject.next(this.actualRouteUrl);
  }
}