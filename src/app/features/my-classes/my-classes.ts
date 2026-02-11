import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { sign } from 'node:crypto';

@Component({
  selector: 'app-my-classes',
  imports: [MatIcon],
  templateUrl: './my-classes.html',
  styleUrl: './my-classes.scss',
})
export class MyClasses {
  isModalNovaTurmaOpen = signal(false)
  isModalNovoAlunoOpen = signal(false)

  handleModalNovaTurma(): void {
    this.isModalNovaTurmaOpen.set(!this.isModalNovaTurmaOpen());
  }

  handleModalNovoAluno(): void {
    this.isModalNovoAlunoOpen.set(!this.isModalNovaTurmaOpen());
  }

}
