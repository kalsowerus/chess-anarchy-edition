import { PieceType } from './piece-type';
import { Color } from './color';
import { Position } from 'types/position';
import { Board } from 'types/board';
import { Move } from 'types/move';

export class Piece {
  constructor(
    public readonly type: PieceType,
    public readonly color: Color,
    public readonly hasMoved: boolean = false) {}

  public getImageCode(): string {
    return `${this.color.colorCode}${this.type.typeCode}`;
  }

  public getMoves(from: Position, board: Board): Move[] {
    return this.type.move.getMoves(this, from, board);
  }

  public getCastlingMoves(from: Position, board: Board): Move[] {
    return this.type.move.getCastlingMoves(this, from, board);
  }

  public setMoved(hasMoved: boolean): Piece {
    return new Piece(this.type, this.color, hasMoved);
  }
}
