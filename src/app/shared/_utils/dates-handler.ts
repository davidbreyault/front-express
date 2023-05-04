export class DatesHandler {

  public static toDateString(date: Date): string {
    const dateItems: string[] = date.toLocaleDateString().split('/');
    return `${dateItems[2]}-${dateItems[1]}-${dateItems[0]}`;
  }
}