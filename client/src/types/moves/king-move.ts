import { PieceMove } from 'types/moves/piece-move';
import { Board } from 'types/board';
import { Position } from 'types/position';
import { Piece } from 'types/piece';
import { Move } from 'types/move';
import { Vector } from 'types/vector';
import { PieceType } from 'types/piece-type';

export class KingMove extends PieceMove {
  private readonly relativePositions = [
    new Vector(1, -1),
    new Vector(1, 0),
    new Vector(1, 1),
    new Vector(0, -1),
    new Vector(0, 1),
    new Vector(-1, -1),
    new Vector(-1, 0),
    new Vector(-1, 1),
  ];

  private readonly castlingDirections = [
    new Vector(-1, 0),
    new Vector(1, 0),
    new Vector(0, -1),
    new Vector(0, 1)
  ];

  private readonly uncastleMoves: Map<Position, Move> = new Map();

  public getMoves(piece: Piece, from: Position, board: Board): Move[] {
    return this.getRelativeMoves(piece, from, board, this.relativePositions);
  }

  public override getCastlingMoves(piece: Piece, from: Position, board: Board): Move[] {
    if (piece.hasMoved) {
      return [];
    }

    const moves: Move[] = [];

    const uncastleMove = this.uncastleMoves.get(from);
    if (uncastleMove != null && !uncastleMove.extraMoves[0]?.piece.hasMoved) {
      moves.push(uncastleMove);
    }

    for (const direction of this.castlingDirections) {
      const first = from.add(direction);
      const second = first.add(direction);

      if (board.hasPieceAt(first)
        || board.hasPieceAt(second)
        || board.isSquareAttacked(from, piece.color)
        || board.isSquareAttacked(first, piece.color)
        || board.isSquareAttacked(second, piece.color)) {
        continue;
      }

      let current = second;
      while (!board.hasPieceAt(current) && board.contains(current)) {
        current = current.add(direction);
      }

      const rook = board.getPiece(current);
      if (rook != null && !rook.hasMoved && rook.type === PieceType.ROOK) {
        this.uncastleMoves.set(second, new Move(piece, second, from, [], [
          new Move(rook, first, current, [], [], false)
        ], false));
        moves.push(new Move(piece, from, second, [], [
          new Move(rook, current, first, [], [], false)
        ], false));
      }
    }

    return moves;
  }
}
