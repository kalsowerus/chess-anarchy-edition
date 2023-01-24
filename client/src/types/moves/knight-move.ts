import { PieceMove } from 'types/moves/piece-move';
import { Position } from 'types/position';
import { Board } from 'types/board';
import { Piece } from 'types/piece';
import { Move } from 'types/move';
import { Vector } from 'types/vector';

export class KnightMove extends PieceMove {
  private readonly relativePositions = [
    new Vector(-2, -1),
    new Vector(-2, 1),
    new Vector(-1, -2),
    new Vector(-1, 2),
    new Vector(1, -2),
    new Vector(1, 2),
    new Vector(2, -1),
    new Vector(2, 1),
  ];

  getMoves(piece: Piece, from: Position, board: Board): Move[] {
    return this.getRelativeMoves(piece, from, board, this.relativePositions);
  }
}
