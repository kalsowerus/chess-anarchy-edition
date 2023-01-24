import { PieceMove } from 'types/moves/piece-move';
import { Piece } from 'types/piece';
import { Position } from 'types/position';
import { Board } from 'types/board';
import { Move } from 'types/move';
import { Vector } from 'types/vector';
import { PieceType } from 'types/piece-type';
import { containsPosition } from 'util/util';

export class BishopMove extends PieceMove {
  private readonly directions = [
    new Vector(1, 1),
    new Vector(1, -1),
    new Vector(-1, 1),
    new Vector(-1, -1)
  ];

  private readonly ilVaticanoDirections = [
    new Vector(-1, 0),
    new Vector(1, 0),
    new Vector(0, -1),
    new Vector(0, 1)
  ];

  getMoves(piece: Piece, from: Position, board: Board): Move[] {
    const moves: Move[] = []

    moves.push(...this.getNormalMoves(piece, from, board));

    moves.push(...this.getChainingMoves(piece, from, from, [], [], board));

    return moves;
  }

  public getNormalMoves(piece: Piece, from: Position, board: Board): Move[] {
    return this.getLinearMoves(piece, from, board, this.directions);
  }

  private getChainingMoves(piece: Piece, from: Position, current: Position, captures: Position[], extraMoves: Move[], board: Board): Move[] {
    const moves: Move[] = [];
    for (const direction of this.ilVaticanoDirections) {
      const firstPosition = current.add(direction);
      const secondPosition = firstPosition.add(direction);
      const thirdPosition = secondPosition.add(direction);

      if (this.isOpponentPiece(piece, firstPosition, board)
        && !containsPosition(captures, firstPosition)
        && this.isOpponentPiece(piece, secondPosition, board)
        && !containsPosition(captures, secondPosition)
        && this.isFriendlyBishop(piece, thirdPosition, board)) {
        const otherBishop = board.getPiece(thirdPosition)!;
        const newCaptures = [...captures, firstPosition, secondPosition];
        const newExtraMoves = [
          ...extraMoves,
          new Move(otherBishop, thirdPosition, current)
        ];
        const move = new Move(piece, from, thirdPosition, newCaptures, newExtraMoves);
        moves.push(move);
        moves.push(...this.getChainingMoves(piece, from, thirdPosition, newCaptures, newExtraMoves, board));
      }
    }

    return moves;
  }

  private isFriendlyBishop(piece: Piece, position: Position, board: Board): boolean {
    const otherPiece = board.getPiece(position);
    return otherPiece?.color === piece.color && otherPiece.type === PieceType.BISHOP;
  }
}
