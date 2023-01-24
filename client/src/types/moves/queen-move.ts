import { PieceMove } from 'types/moves/piece-move';
import { Board } from 'types/board';
import { Position } from 'types/position';
import { Piece } from 'types/piece';
import { BishopMove } from 'types/moves/bishop-move';
import { RookMove } from 'types/moves/rook-move';
import { Move } from 'types/move';

export class QueenMove extends PieceMove {
  private readonly bishopMove = new BishopMove();
  private readonly rookMove = new RookMove();

  getMoves(piece: Piece, from: Position, board: Board): Move[] {
    return [
      ...this.bishopMove.getNormalMoves(piece, from, board),
      ...this.rookMove.getMoves(piece, from, board)
    ];
  }
}
