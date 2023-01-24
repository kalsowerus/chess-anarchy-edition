import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from '../components/board/board.component';
import { PieceComponent } from '../components/piece/piece.component';
import { PieceSetService } from '../services/piece-set.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PieceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    PieceSetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
