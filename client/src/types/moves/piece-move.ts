import { Position } from 'types/position';
import { Board } from 'types/board';
import { Piece } from 'types/piece';
import { Move } from 'types/move';
import { Vector } from 'types/vector';

export abstract class PieceMove {
  public abstract getMoves(piece: Piece, from: Position, board: Board): Move[];

  public getCastlingMoves(piece: Piece, from: Position, board: Board): Move[] {
    return [];
  }

  protected getLinearMoves(piece: Piece, from: Position, board: Board, directions: Vector[]): Move[] {
    const moves: Move[] = [];
    for (const direction of directions) {
      let current = from.add(direction);
      while (true) {
        if (!board.contains(current)) {
          break;
        }
        if (board.hasPieceAt(current)) {
          if (this.isOpponentPiece(piece, current, board)) {
            moves.push(new Move(piece, from, current, [current]));
          }
          break;
        }
        moves.push(new Move(piece, from, current));
        current = current.add(direction);
      }
    }
    return moves;
  }

  protected getRelativeMoves(piece: Piece, from: Position, board: Board, relativePositions: Vector[]): Move[] {
    const moves: Move[] = [];
    for (const relativePosition of relativePositions) {
      const position = from.add(relativePosition);
      if (!board.contains(position)) {
        continue;
      }
      if (board.hasPieceAt(position)) {
        if (this.isOpponentPiece(piece, position, board)) {
          moves.push(new Move(piece, from, position, [position]));
        }
        continue;
      }
      moves.push(new Move(piece, from, position));
    }
    return moves;
  }

  protected isOpponentPiece(piece: Piece, position: Position, board: Board): boolean {
    const other = board.getPiece(position);
    if (other == null) {
      return false;
    }

    return piece.color !== other.color;
  }
}
