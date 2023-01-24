import { PieceMove } from 'types/moves/piece-move';
import { Position } from 'types/position';
import { Board } from 'types/board';
import { Piece } from 'types/piece';
import { Move } from 'types/move';
import { Vector } from 'types/vector';
import { PieceType } from 'types/piece-type';
import { containsPosition } from 'util/util';

export class PawnMove extends PieceMove {
  private readonly moveOneForward = new Vector(0, 1);
  private readonly moveTwoForward = new Vector(0, 2);
  private readonly moveForwardLeft = new Vector(-1, 1);
  private readonly moveForwardRight = new Vector(1, 1);
  private readonly moveOneBackward = new Vector(0, -1);
  private readonly moveBackwardLeft = new Vector(-1, -1);
  private readonly moveBackwardRight = new Vector(1, -1);

  private readonly captureMoves = [
    this.moveForwardLeft,
    this.moveForwardRight
  ];

  private readonly enArriereMoves = [
    this.moveBackwardLeft,
    this.moveBackwardRight
  ];

  public getMoves(piece: Piece, from: Position, board: Board): Move[] {
    const moves: Move[] = [];
    const normalFrom = from.normalize(piece.color, board);

    // normal move
    const oneForward = from.addNormalized(this.moveOneForward, piece.color, board);
    if (!board.hasPieceAt(oneForward)) {
      moves.push(new Move(piece, from, oneForward));
    }

    // two forward from starting position
    const twoForward = from.addNormalized(this.moveTwoForward, piece.color, board);
    if (normalFrom.y === 1 && !board.hasPieceAt(oneForward) && !board.hasPieceAt(twoForward)) {
      moves.push(new Move(piece, from, twoForward));
    }

    // capture
    for (const captureMove of this.captureMoves) {
      const capture = from.addNormalized(captureMove, piece.color, board);
      if (this.isOpponentPiece(piece, capture, board)) {
        moves.push(new Move(piece, from, capture, [capture]));
      }

      // en passent
      const enPassentCapture = capture.addNormalized(this.moveOneBackward, piece.color, board);
      if (this.isOpponentPawn(piece, enPassentCapture, board)
        && this.hasPawnBoostedOnPreviousMove(enPassentCapture, board)) {
        const move = new Move(piece, from, capture, [enPassentCapture]);
        moves.push(move);
        moves.push(...this.getChainingMoves(move, board));
      }
    }

    // en arriere
    for (const captureMove of this.enArriereMoves) {
      const capture = from.addNormalized(captureMove, piece.color, board);
      if (this.isOpponentPawn(piece, capture, board)
        && this.hasPawnBoostedOnPreviousMove(capture, board)) {
        moves.push(new Move(piece, from, capture, [capture]));
      }
    }

    // because of knight boosting, knight promotion has to be taken into account when calculating checks
    const promotionMoves = moves.filter(move => move.to.normalize(piece.color, board).y === board.height - 1);
    const knight = new Piece(PieceType.KNIGHT, piece.color);
    for (const promotionMove of promotionMoves) {
      moves.push(new Move(
        knight,
        new Position(-1, -1),
        promotionMove.to,
        [...promotionMove.captures, ...knight.getMoves(promotionMove.to, board).flatMap(move => move.captures)],
        promotionMove.extraMoves));
    }

    return moves;
  }

  private getChainingMoves(move: Move, board: Board): Move[] {
    const moves: Move[] = [];
    const piece = move.piece;
    const start = move.from;
    const from = move.to;
    const captures = move.captures;

    // en passent
    for (const captureMove of this.captureMoves) {
      const capture = from.addNormalized(captureMove, piece.color, board);
      const enPassentCapture = capture.addNormalized(this.moveOneBackward, piece.color, board);
      if (this.isOpponentPawn(piece, enPassentCapture, board)
        && !board.hasPieceAt(capture)
        && !containsPosition(captures, enPassentCapture)) {
        const move = new Move(piece, start, capture, [...captures, enPassentCapture]);
        moves.push(move);
        moves.push(...this.getChainingMoves(move, board));
      }
    }

    // en arriere
    for (const captureMove of this.enArriereMoves) {
      const capture = from.addNormalized(captureMove, piece.color, board);
      if (this.isOpponentPawn(piece, capture, board) && !containsPosition(captures, capture)) {
        const move = new Move(piece, start, capture, [...captures, capture]);
        moves.push(move);
        moves.push(...this.getChainingMoves(move, board));
      }
    }

    return moves;
  }

  private isOpponentPawn(piece: Piece, position: Position, board: Board): boolean {
    return this.isOpponentPiece(piece, position, board) && board.getPiece(position)?.type === PieceType.PAWN;
  }

  private hasPawnBoostedOnPreviousMove(position: Position, board: Board): boolean {
    const lastMove = board.lastMove;
    if (lastMove == null) {
      return false;
    }
    return lastMove.piece.type === PieceType.PAWN
      && position.equals(lastMove.to)
      && Math.abs(lastMove.from.y - lastMove.to.y) === 2
      && lastMove.from.x === lastMove.to.x;
  }
}
