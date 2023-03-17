import { Note } from "./note.model";

export class ResponseNotes {
  notes!: Note[];
  currentPage!: number;
  totalItems!: number;
  totalPages!: number;
  ts!: number;
}