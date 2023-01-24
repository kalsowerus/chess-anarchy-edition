import { UnknownColorError } from 'types/errors';

export class Color {
  public static readonly WHITE = new Color('w');
  public static readonly BLACK = new Color('b');

  public static of(code: string): Color {
    switch (code) {
      case 'w':
        return this.WHITE;
      case 'b':
        return this.BLACK;
      default:
        throw new UnknownColorError(`Color code ${code} is not known`);
    }
  }

  constructor(
    public readonly colorCode: string
  ) {}
}
