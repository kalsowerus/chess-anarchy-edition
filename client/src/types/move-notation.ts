import { Piece } from 'types/piece';
import { PieceType } from 'types/piece-type';
import { Position } from 'types/position';
import { Board } from 'types/board';
import { Move } from 'types/move';
import { MoveType } from 'types/move-type';

export class MoveNotation {
  constructor(
    public readonly move: Move,
    public readonly board: Board,
    public readonly promotion?: Piece
  ) {}

  public getNotationString(): string {
    switch (this.move.type) {
      case MoveType.NORMAL:
        return `${this.getPieceName()}${this.getCaptures()}${this.getToPosition()}${this.getPromotion()}${this.getCheck()}`;
      case MoveType.CASTLE:
        return this.getCastle();
      case MoveType.UNCASTLE:
        return this.getUncastle();
    }
    return 'invalid move type';
  }

  private getPieceName(): string {
    if (this.move.piece.type === PieceType.PAWN) {
      return this.move.captures.length > 0 ? this.move.from.getFileName() : '';
    }
    return this.move.piece.type.typeCode;
  }

  private getCaptures(): string {
    return 'x'.repeat(this.move.captures.length);
  }

  private getToPosition(): string {
    return `${this.move.to.getPositionName()}`;
  }

  private getPromotion(): string {
    if (this.promotion != null) {
      return `=${this.promotion.type.typeCode}`;
    }
    return '';
  }

  private getCheck(): string {
    if (this.board.isKingInCheck()) {
      if (this.board.legalMoves.length > 0) {
        return '+';
      }
      return '#';
    }
    return '';
  }

  private getCastle(): string {
    const castleMove = this.move.extraMoves[0]!;
    const distance = Math.abs(castleMove.from.x - castleMove.to.x) + Math.abs(castleMove.from.y - castleMove.to.y);
    return 'O'.repeat(distance).split('').join('-');
  }

  private getUncastle(): string {
    return `-${this.getCastle()}`;
  }
}
