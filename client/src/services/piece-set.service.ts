import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PieceSet } from 'types/piece-set';

@Injectable()
export class PieceSetService {
  public readonly defaultPieceSet = PieceSet.HORSEY;
  public readonly selectedPieceSet$ = new BehaviorSubject(this.defaultPieceSet);
}
