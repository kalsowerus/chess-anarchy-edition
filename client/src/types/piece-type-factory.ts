import { PieceType } from 'types/piece-type';
import { UnknownPieceTypeError } from 'types/errors';

export class PieceTypeFactory {
  public static pieceTypes = [
    PieceType.PAWN,
    PieceType.ROOK,
    PieceType.KNIGHT,
    PieceType.BISHOP,
    PieceType.QUEEN,
    PieceType.KING
  ]

  public fromString(code: string): PieceType {
    for (const pieceType of PieceTypeFactory.pieceTypes) {
      if (pieceType.typeCode === code) {
        return pieceType;
      }
    }

    throw new UnknownPieceTypeError(`Piece type code ${code} is not known`);
  }
}
