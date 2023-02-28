import { AlertType } from "src/app/shared/_models/alert.model";
import { Comment } from "./comment.model";

export class CommentDeletionData {
  comment!: Comment;
  deletionSuccess!: boolean;
  deleteMessage!: string;
  alertType!: AlertType;
}