import { Position } from './position';
import { Piece } from './piece';
import { Color } from 'types/color';
import { PieceTypeFactory } from 'types/piece-type-factory';
import { defaultBoard } from 'types/boards/default-board';
import { Move } from 'types/move';
import { PieceType } from 'types/piece-type';
import { MoveNotation } from 'types/move-notation';

export class Board {
  public static readonly DEFAULT = Board.of(defaultBoard);

  public static of(board: string[][], pieceTypeFactory = new PieceTypeFactory()): Board {
    board.reverse();
    let width = 0;
    let height = 0;
    const pieces: [Position, Piece][] = [];
    let y = 0;
    for (const row of board) {
      let x = 0
      for (const square of row) {
        if (square.length !== 2) {
          continue;
        }
        const position = new Position(x, y);
        const [colorCode, pieceTypeCode] = square;
        const pieceType = pieceTypeFactory.fromString(pieceTypeCode);
        const color = Color.of(colorCode);
        pieces.push([position, new Piece(pieceType, color)]);
        x++;
        width = Math.max(width, x);
      }
      y++;
      height = Math.max(height, y);
    }
    return new Board(pieces, width, height);
  }

  public readonly moves: Move[];
  private _legalMoves?: Move[];

  constructor(
    public readonly pieces: [Position, Piece][],
    public readonly width: number,
    public readonly height: number,
    public readonly turn: Color = Color.WHITE,
    public readonly history: MoveNotation[] = [],
    public readonly lastMove?: Move
  ) {
    this.moves = this.pieces.flatMap(([position, piece]) => piece.getMoves(position, this));
    this.moves = [
      ...this.moves,
      ...this.pieces.flatMap(([position, piece]) => piece.getCastlingMoves(position, this))
    ];
  }

  public get legalMoves(): Move[] {
    if (this._legalMoves == null) {
      this._legalMoves = this.moves.filter(move => {
        if (move.piece.color !== this.turn) {
          return false;
        }
        const board = this.doMove(move.from, move.to);
        return !board.isKingInCheck(this.turn);
      })
    }
    return this._legalMoves;
  }

  public doMove(from: Position, to: Position, newPiece?: Piece): Board {
    const move = this.moves.find(move => move.from.equals(from) && move.to.equals(to));
    if (move == null) {
      throw new Error('Illegal move');
    }
    return BoardBuilder.of(this).doMove(move, newPiece);
  }

  public isKingInCheck(color: Color = this.turn): boolean {
    for (const [position, piece] of this.pieces) {
      if (piece.type === PieceType.KING && piece.color === color) {
        return this.isSquareAttacked(position, color);
      }
    }
    return false;
  }

  public isSquareAttacked(position: Position, color: Color): boolean {
    for (const move of this.moves) {
      if (move.piece.color === color) {
        continue;
      }
      if (move.captures.find(capture => position.equals(capture)) != null) {
        return true;
      }
    }
    return false;
  }

  public getPiece(position: Position): Piece | undefined {
    const {x, y} = position;
    return this.pieces.find(([position]) => position.x === x && position.y === y)?.[1];
  }

  public contains(position: Position): boolean {
    return position.x >= 0 && position.x < this.width
      && position.y >= 0 && position.y < this.height;
  }

  public hasPieceAt(position: Position): boolean {
    return this.getPiece(position) != null;
  }
}

class BoardBuilder {
  public static of(board: Board): BoardBuilder {
    return new BoardBuilder(
      board.pieces,
      board.width,
      board.height,
      board.turn,
      [...board.history],
      board.lastMove
    );
  }

  constructor(
    public pieces: [Position, Piece][],
    public width: number,
    public height: number,
    public turn: Color = Color.WHITE,
    public history: MoveNotation[] = [],
    public lastMove?: Move
  ) {}

  public setPieces(pieces: [Position, Piece][]): BoardBuilder {
    this.pieces = pieces;
    return this;
  }

  public setTurn(turn: Color): BoardBuilder {
    this.turn = turn;
    return this;
  }

  public setLastMove(lastMove: Move): BoardBuilder {
    this.lastMove = lastMove;
    return this;
  }

  public removePiece(position: Position): BoardBuilder {
    const {x, y} = position;
    const pieces = this.pieces.filter(([position]) => position.x !== x || position.y !== y);
    return this.setPieces(pieces);
  }

  public putPiece(position: Position, piece: Piece): BoardBuilder {
    const pieces = [...this.pieces];
    pieces.push([position, piece]);
    return this.setPieces(pieces);
  }

  public changeTurn(): BoardBuilder {
    if (this.turn === Color.WHITE) {
      return this.setTurn(Color.BLACK);
    } else {
      return this.setTurn(Color.WHITE);
    }
  }

  public doMove(move: Move, newPiece?: Piece, nestedMove = false): Board {
    for (const capture of move.captures) {
      this.removePiece(capture);
    }
    this.removePiece(move.from);
    for (const extraMove of move.extraMoves) {
      this.doMove(extraMove, undefined, true);
    }

    if (move.countsAsMove) {
      this.putPiece(move.to, newPiece ?? move.piece.setMoved(true));
    } else {
      this.putPiece(move.to, newPiece ?? move.piece);
    }

    if (!nestedMove && newPiece?.type !== PieceType.KNIGHT) {
      this.changeTurn();
    }
    const board = this.setLastMove(move).build();
    const moveNotation = new MoveNotation(move, board, newPiece);
    board.history.push(moveNotation);
    return board;
  }

  public build(): Board {
    return new Board(
      this.pieces,
      this.width,
      this.height,
      this.turn,
      this.history,
      this.lastMove
    );
  }
}
