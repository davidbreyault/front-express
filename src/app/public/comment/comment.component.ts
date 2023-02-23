import { Component, Input } from '@angular/core';
import { TokenService } from 'src/app/shared/_services/token.service';
import { Comment } from '../_models/comment.model';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {

  @Input() comment!: Comment;

  constructor(
    private tokenService: TokenService, 
    private authenticationService: AuthenticationService
  ) {}

  postedByLoggedUser(): boolean {
    if (this.authenticationService.getAuthenticationData().isAuthenticated) {
      if (this.comment.username === this.tokenService.getJwtUsername()) {
        return true;
      }
    }
    return false;
  }
}
