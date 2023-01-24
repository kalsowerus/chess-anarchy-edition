import { PieceMove } from 'types/moves/piece-move';
import { KnightMove } from 'types/moves/knight-move';
import { PawnMove } from 'types/moves/pawn-move';
import { KingMove } from 'types/moves/king-move';
import { RookMove } from 'types/moves/rook-move';
import { BishopMove } from 'types/moves/bishop-move';
import { QueenMove } from 'types/moves/queen-move';
import { KnookMove } from 'types/moves/knook-move';

export class PieceType {
  public static readonly PAWN = new PieceType('P', new PawnMove());
  public static readonly ROOK = new PieceType('R', new RookMove());
  public static readonly KNIGHT = new PieceType('N', new KnightMove());
  public static readonly BISHOP = new PieceType('B', new BishopMove());
  public static readonly QUEEN = new PieceType('Q', new QueenMove());
  public static readonly KING = new PieceType('K', new KingMove());
  public static readonly KNOOK = new PieceType('Ñ', new KnookMove());

  constructor(
    public readonly typeCode: string,
    public readonly move: PieceMove
  ) {}
}
