import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {QuizOptionComponent} from './components/quiz-option/quiz-option.component';
import {QuizQuestionComponent} from './components/quiz-question/quiz-question.component';
import {QuizComponent} from './quiz.component';
import {MATERIAL_SANITY_CHECKS} from '@angular/material/core';
import {QuizService} from './services/quiz.service';

@NgModule({
  declarations: [QuizComponent, QuizOptionComponent, QuizQuestionComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  exports: [QuizComponent],
  providers: [{provide: MATERIAL_SANITY_CHECKS, useValue: false}, QuizService],
})
export class QuizModule {}
