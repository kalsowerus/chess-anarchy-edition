import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Piece } from 'types/piece';
import { PieceSetService } from '../../services/piece-set.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieceComponent {
  @Input()
  public piece?: Piece;

  constructor(
    private readonly pieceSetService: PieceSetService
  ) {}

  public getImage$(): Observable<string> {
    return this.pieceSetService.selectedPieceSet$.pipe(
      map(pieceSet => `${pieceSet.path}/${this.piece?.getImageCode()}.svg`)
    );
  }

  public getAlt(): string {
    return `${this.piece?.getImageCode()}`;
  }

  public onMouseDown(event: MouseEvent): void {
    event.preventDefault();
  }
}
