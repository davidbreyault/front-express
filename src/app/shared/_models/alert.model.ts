export class Alert {
  id!: number;
  notification!: string;
  type!: AlertType;
  isVisible!: boolean;
  inDialogOnly!: boolean;
}

export enum AlertType {
  success,
  error
}