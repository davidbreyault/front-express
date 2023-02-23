import { Component, Input, OnInit } from '@angular/core';
import { TokenService } from 'src/app/shared/_services/token.service';
import { Affiliations } from '../affiliations';
import { Comment } from '../_models/comment.model';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent extends Affiliations implements OnInit {

  @Input() comment!: Comment;

  constructor(
    protected override tokenService: TokenService, 
    protected override authenticationService: AuthenticationService
  ) {
    super(tokenService, authenticationService);
  }

  ngOnInit(): void {
    this.isPostedByLoggedUser(this.comment)
  }
}
