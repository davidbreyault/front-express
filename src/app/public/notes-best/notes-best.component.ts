import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterService } from '../_services/router.service';

@Component({
  selector: 'app-notes-best',
  templateUrl: './notes-best.component.html',
  styleUrls: ['./notes-best.component.scss']
})
export class NotesBestComponent implements OnInit {

  constructor(private router: Router, private routerService: RouterService) { }

  ngOnInit(): void {
    this.routerService.setActualRouteUrl(this.router.url);
  }

}
