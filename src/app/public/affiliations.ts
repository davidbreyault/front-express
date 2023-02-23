import { TokenService } from "../shared/_services/token.service";
import { Comment } from "./_models/comment.model";
import { Note } from "./_models/note.model";
import { AuthenticationService } from "./_services/authentication.service";

export abstract class Affiliations {

  constructor(
    protected tokenService: TokenService,
    protected authenticationService: AuthenticationService
  ) {}

  isPostedByLoggedUser(entity: Note | Comment): boolean {
    if (this.authenticationService.getAuthenticationData().isAuthenticated) {
      if (this.isNote(entity)) {
        if (entity.author === this.tokenService.getJwtUsername()) {
          return true;
        }
      }
      if (this.isComment(entity)) {
        if (entity.username === this.tokenService.getJwtUsername()) {
          return true;
        }
      }
    }
    return false;
  }

  isNote(entity: Note | Comment): entity is Note {
    return (entity as Note).author ? true : false;
  }

  isComment(entity: Note | Comment): entity is Comment {
    return (entity as Comment).username ? true : false;
  }
}