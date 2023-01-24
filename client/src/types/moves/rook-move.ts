import { PieceMove } from 'types/moves/piece-move';
import { Piece } from 'types/piece';
import { Position } from 'types/position';
import { Board } from 'types/board';
import { Move } from 'types/move';
import { Vector } from 'types/vector';

export class RookMove extends PieceMove {
  private readonly directions = [
    new Vector(1, 0),
    new Vector(-1, 0),
    new Vector(0, 1),
    new Vector(0, -1),
  ];

  public getMoves(piece: Piece, from: Position, board: Board): Move[] {
    return this.getLinearMoves(piece, from, board, this.directions);
  }
}
