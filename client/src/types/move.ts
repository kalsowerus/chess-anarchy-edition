import { Piece } from 'types/piece';
import { Position } from 'types/position';
import { MoveType } from 'types/move-type';

export class Move {
  constructor(
    public readonly piece: Piece,
    public readonly from: Position,
    public readonly to: Position,
    public readonly captures: Position[] = [],
    public readonly extraMoves: Move[] = [],
    public readonly countsAsMove = true,
    public readonly type: MoveType = MoveType.NORMAL
  ) {}
}
