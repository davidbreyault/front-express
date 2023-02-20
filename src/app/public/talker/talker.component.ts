import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-talker',
  templateUrl: './talker.component.html',
  styleUrls: ['./talker.component.scss']
})
export class TalkerComponent {

  @Input() username!: string;
  @Input() notes!: number;
  @Input() comments!: number;
}
