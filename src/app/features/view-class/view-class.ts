import { Component, inject, OnInit, signal, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { MatTabsModule } from '@angular/material/tabs'
import { MatIconModule } from "@angular/material/icon";
import { CourseClassService } from "../../services/api-services/courseClass.service";
import { CourseClassResponseDTO } from "../../models/courseClass.model";
import { DateFormatter } from '../../shared/common-functions/shared.functions';
import { ClassStudents } from "./class-students/class-students";


@Component({
    selector: 'app-view-class',
    imports: [MatIconModule, MatTabsModule, ClassStudents],
    templateUrl: './view-class.html',
    styleUrl: './view-class.scss',
})
export class ViewClass implements OnInit {
    private route = inject(ActivatedRoute)
    readonly DateFormatter = DateFormatter;
    private router = inject(Router)
    private location = inject(Location)
    private courseService = inject(CourseClassService)

    readonly classId = signal<string>('')

    course = signal<CourseClassResponseDTO | null>(null)
    loading = signal(false)
    error = signal<string | null>(null)

    isActive = computed(() => {
        const endDate = this.course()?.endDate

        if (!endDate) return false

        return new Date(endDate) >= new Date()
    })

    ngOnInit(): void {
        const classId = this.route.snapshot.paramMap.get('classId')

        if (!classId) {
            this.error.set('Identificador da turma não encontrado.')
            return
        }

        this.classId.set(classId)
        this.fetchClass()
    }

    goBack() {
        this.router.navigate(['/classes'])
    }

    fetchClass(): void {
        if (!this.classId()) {
            this.error.set('Identificador da turma não encontrado.')
            return
        }

        this.loading.set(true)
        this.error.set(null)

        this.courseService.getCourseById(this.classId()).subscribe({
            next: (classCourse) => {
                this.course.set(classCourse)
                this.loading.set(false)
            },
            error: (error) => {
                console.error('Erro ao buscar turma:', error)
                this.error.set('Não foi possível carregar os dados da turma.')
                this.loading.set(false)
            }
        })
    }
}
