import { Component, inject, Input, OnInit, signal } from "@angular/core";
import { CourseClassService } from "../../../services/api-services/courseClass.service";
import { StudentDTO } from "../../../models/courseClass.model";
import { MatIcon, MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-class-students',
    standalone: true,
    imports: [MatIcon, MatIconModule],
    templateUrl: './class-students.html',
    styleUrl: './class-students.scss'
})

export class ClassStudents implements OnInit {
    @Input({ required: true }) classId!: string;

    private courseService = inject(CourseClassService);

    students = signal<StudentDTO[]>([]);
    loading = signal(false);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.fetchStudents();
    }

    fetchStudents(): void {
        this.loading.set(true);
        this.error.set(null);

        this.courseService.getStudentsByCourseId(this.classId).subscribe({
            next: (students) => {
                this.students.set(students);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Erro ao buscar alunos:', error);
                this.error.set('Não foi possível carregar os alunos da turma.');
                this.loading.set(false);
            }
        });
    }
}