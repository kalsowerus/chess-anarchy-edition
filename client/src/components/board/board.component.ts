import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { containsPosition, range } from 'src/util/util';
import { Piece } from 'types/piece';
import { Board } from 'types/board';
import { BehaviorSubject, combineLatest, first, map, Observable, Subject, takeUntil } from 'rxjs';
import { Position } from 'types/position';
import { PieceType } from 'types/piece-type';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  public readonly board$ = new BehaviorSubject(Board.DEFAULT);
  public readonly width$ = this.board$.pipe(map(board => board.width));
  public readonly height$ = this.board$.pipe(map(board => board.height));
  public readonly turn$ = this.board$.pipe(map(board => board.turn));
  public readonly previewSize$ = this.width$.pipe(map(width => `calc(100cqw / ${width})`));
  public readonly isCheckmate$ = this.board$
    .pipe(map(board => board.legalMoves.length === 0 && board.isKingInCheck()));
  public readonly isStalemate$ = this.board$
    .pipe(map(board => board.legalMoves.length === 0 && !board.isKingInCheck()));

  public readonly showPromotionPopup$ = new BehaviorSubject(false);
  public readonly promotionPieces$ = this.board$.pipe(map(board => [
    new Piece(PieceType.KNOOK, board.turn),
    new Piece(PieceType.QUEEN, board.turn),
    new Piece(PieceType.ROOK, board.turn),
    new Piece(PieceType.KNIGHT, board.turn),
    new Piece(PieceType.BISHOP, board.turn)
  ]));
  private promotionCallback?: (piece: Piece) => void;

  public readonly range = range;

  public dragging = false;
  public moveOrigin?: Position;
  public draggingPiece$ = new BehaviorSubject<Piece | undefined>(undefined);
  public legalMovesForDraggingPiece$ = combineLatest([this.board$, this.draggingPiece$]).pipe(
    map(([board, piece]) => {
      if (piece == null) {
        return [];
      }
      return board.legalMoves
        .filter(move => move.piece === piece)
        .map(move => move.to);
    })
  );
  public readonly mousePosition$ = new BehaviorSubject<Position>(new Position(0, 0));

  public readonly boardFlipped$ = new BehaviorSubject(false);

  public readonly moveHistory$ = this.board$.pipe(map(board => {
    const moves = board.history.map(notation => notation.getNotationString());
    const turns = [];
    for (let i = 0; i < moves.length; i += 2) {
      turns.push(moves.slice(i, i + 2));
    }
    return turns;
  }));

  public ngOnInit(): void {
    // setTimeout to make sure alert shows up after board updated
    this.isCheckmate$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isCheckmate => {
      if (isCheckmate) {
        setTimeout(() => alert('Checkmate!'), 0);
      }
    });
    this.isStalemate$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isStalemate => {
      if (isStalemate) {
        setTimeout(() => alert('Stalemate!'), 0);
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
  }

  public getRank(index: number): string {
    return (index + 1).toString(10);
  }

  public getFile(index: number): string {
    return String.fromCharCode(index + 97);
  }

  public getPiece$(x: number, y: number): Observable<Piece | undefined> {
    return combineLatest([
      this.board$,
      this.draggingPiece$
    ]).pipe(
      map(([board, draggingPiece]) => {
        const position = new Position(x, y);
        const piece = board.getPiece(position);
        if (piece !== draggingPiece) {
          return piece;
        }
        return undefined;
      })
    );
  }

  public preventDefault(event: Event): void {
    event.preventDefault();
  }

  public isLegalMove(x: number, y: number): Observable<boolean> {
    const position = new Position(x, y);
    return this.legalMovesForDraggingPiece$.pipe(
      map(moves => moves.find(move => move.equals(position)) != null)
    );
  }

  public startDragging(x: number, y: number, piece: Piece): void {
    this.turn$.pipe(
      first()
    ).subscribe(turn => {
      if (turn !== piece.color) {
        return;
      }
      this.dragging = true;
      this.draggingPiece$.next(piece);
      this.moveOrigin = new Position(x, y);
    });
  }

  public stopDragging(x: number, y: number): void {
    if (!this.dragging || this.moveOrigin == null) {
      return;
    }
    if (x === this.moveOrigin?.x && y === this.moveOrigin?.y) {
      this.cancelDragging();
      return;
    }
    combineLatest([
      this.board$,
    ])
    const from = this.moveOrigin;
    const to = new Position(x, y);
    combineLatest([
      this.board$,
      this.draggingPiece$,
      this.legalMovesForDraggingPiece$
    ]).pipe(
      first()
    ).subscribe(async ([board, draggingPiece, legalMoves]) => {
      if (!containsPosition(legalMoves, to) || draggingPiece == null) {
        this.cancelDragging();
        return;
      }
      this.draggingPiece$.next(undefined);

      // promotion
      let promotion: Piece | undefined;
      if (draggingPiece.type === PieceType.PAWN
        && to.normalize(draggingPiece.color, board).y === board.height - 1) {
        promotion = await this.getPromotion();
      }

      this.board$.next(board.doMove(from, to, promotion));
    });
  }

  public cancelDragging(): void {
    if (!this.dragging) {
      return
    }
    this.dragging = false;
    this.draggingPiece$.next(undefined);
  }

  public onMouseMove(event: MouseEvent): void {
    this.mousePosition$.next(new Position(event.x, event.y));
  }

  public getSquareHighlight(x: number, y: number): Observable<string | undefined> {
    const position = new Position(x, y);
    return this.board$.pipe(
      map(board => {
        if (position.equals(board.lastMove?.from) || position.equals(board.lastMove?.to)) {
          return 'moved';
        }

        return;
      })
    );
  }

  public async getPromotion(): Promise<Piece> {
    return new Promise(resolve => {
      this.promotionCallback = resolve;
      this.showPromotionPopup$.next(true);
    });
  }

  public promoteTo(piece: Piece): void {
    this.promotionCallback?.(piece);
    this.showPromotionPopup$.next(false);
  }

  public flipBoard(): void {
    this.boardFlipped$.pipe(
      first()
    ).subscribe(flipped => this.boardFlipped$.next(!flipped));
  }
}
