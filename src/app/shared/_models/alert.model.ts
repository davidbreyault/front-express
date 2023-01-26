export class Alert {
  id!: number;
  notification!: string;
  type!: AlertType;
}

export enum AlertType {
  success,
  error
}