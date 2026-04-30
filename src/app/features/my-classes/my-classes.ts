import { Component, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CourseClassResponseDTO } from '../../models/courseClass.model';
import { CourseClassService } from '../../services/api-services/courseClass.service';

@Component({
  selector: 'app-my-classes',
  imports: [MatIcon],
  templateUrl: './my-classes.html',
  styleUrl: './my-classes.scss',
})
export class MyClasses implements OnInit {
  isModalNovaTurmaOpen = signal(false)
  isModalNovoAlunoOpen = signal(false)
  isLoading = signal(false)
  currentDate = signal<number>(0)
  courses = signal<CourseClassResponseDTO[]>([])

  constructor(
    private courseService: CourseClassService) {

  }

  ngOnInit(): void {
    this.fetchMyCourses();
    const todayNow = Date.now()
  }
  isCourseActive(endDate?: string | Date): boolean {
    if (!endDate) return true;

    const today = new Date();
    const courseEndDate = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    courseEndDate.setHours(0, 0, 0, 0);

    return courseEndDate > today;
  }

  handleModalNovaTurma(): void {
    this.isModalNovaTurmaOpen.set(!this.isModalNovaTurmaOpen());
  }

  handleModalNovoAluno(): void {
    this.isModalNovoAlunoOpen.set(!this.isModalNovaTurmaOpen());
  }

  fetchMyCourses(): void {
    this.isLoading.set(true);

    this.courseService.getMyCourseClasses().subscribe({
      next: (data) => {
        this.courses.set(data);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
