import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorValidatorService } from 'src/app/shared/_services/error-validator.service';
import { Comment } from '../_models/comment.model';
import { Note } from '../_models/note.model';

interface Data {
  note: Note,
  comments: Comment[]
}

@Component({
  selector: 'app-comments-layout',
  templateUrl: './comments-layout.component.html',
  styleUrls: ['./comments-layout.component.scss']
})
export class CommentsLayoutComponent implements OnInit {

  commentControl!: FormControl;
  commentPostForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<CommentsLayoutComponent>,
    public errorValidatorService: ErrorValidatorService,
    @Inject(MAT_DIALOG_DATA) public data: Data 
  ) {}

  ngOnInit(): void {
    this.initFormControl();
    this.createCommentPostForm();
    console.log(this.data);
  }

  private initFormControl(): void {
    this.commentControl = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ])
  }

  private createCommentPostForm(): void {
    this.commentPostForm = this.formBuilder.group({
      comment: this.commentControl
    })
  }

  onClickCloseCommentsDialog(): void {
    this.matDialogRef.close();
  }

  onSubmitComment(): void {

  }
}
