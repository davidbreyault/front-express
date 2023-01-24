import { Note } from "./note.model";

export class ResponseNotes {
  notes!: Note[];
  totalNotes!: number;
  ts!: number;
}