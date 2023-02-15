import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, tap } from 'rxjs';
import { RouterService } from '../_services/router.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  activatedRoute!: string;
  isAllNotesRoute!: boolean;
  isBestNotesRoute!: boolean;
  isTrendingRoute!: boolean;

  constructor(private routerService: RouterService) { }

  ngOnInit(): void {
    this.routerService.actualRouteUrlSubject.pipe(
      tap((value: string) => {
        this.activatedRoute = value;
        this.toggleActivatedTab();
      })
    ).subscribe();
  }

  toggleActivatedTab(): void {
    this.isAllNotesRoute = this.activatedRoute.startsWith('/notes/all');
    this.isBestNotesRoute = this.activatedRoute.startsWith('/notes/best');
    this.isTrendingRoute = this.activatedRoute.startsWith('/trending');
  }
}
