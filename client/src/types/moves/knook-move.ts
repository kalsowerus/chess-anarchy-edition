import { PieceMove } from 'types/moves/piece-move';
import { RookMove } from 'types/moves/rook-move';
import { KnightMove } from 'types/moves/knight-move';
import { Move } from 'types/move';
import { Board } from 'types/board';
import { Position } from 'types/position';
import { Piece } from 'types/piece';

export class KnookMove extends PieceMove {
  private readonly rookMove = new RookMove();
  private readonly knightMove = new KnightMove();

  getMoves(piece: Piece, from: Position, board: Board): Move[] {
    return [
      ...this.rookMove.getMoves(piece, from, board),
      ...this.knightMove.getMoves(piece, from, board)
    ];
  }
}
