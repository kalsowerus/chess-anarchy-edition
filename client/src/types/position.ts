import { Board } from 'types/board';
import { Color } from 'types/color';
import { Vector } from 'types/vector';

export class Position {
  constructor(public readonly x: number, public readonly y: number) {}

  public flip(board: Board): Position {
    return new Position(board.width - this.x - 1, board.height - this.y - 1);
  }

  public normalize(color: Color, board: Board): Position {
    if (color === Color.BLACK) {
      return this.flip(board);
    } else {
      return this;
    }
  }

  public denormalize(color: Color, board: Board): Position {
    return this.normalize(color, board);
  }

  public add(vector: Vector): Position {
    return new Position(this.x + vector.deltaX, this.y + vector.deltaY);
  }

  public addNormalized(vector: Vector, color: Color, board: Board): Position {
    return this.normalize(color, board).add(vector).denormalize(color, board);
  }

  public equals(other?: Position): boolean {
    if (other == null) {
      return false;
    }

    return this.x === other.x && this.y === other.y;
  }

  public getRankName(): string {
    return (this.y + 1).toString(10);
  }

  public getFileName(): string {
    return String.fromCharCode(this.x + 97);
  }

  public getPositionName(): string {
    return `${this.getFileName()}${this.getRankName()}`;
  }
}
