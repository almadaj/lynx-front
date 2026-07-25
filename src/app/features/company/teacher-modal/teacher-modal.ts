import { Component, EventEmitter, Input, Output, signal } from "@angular/core";
import { CommonModal } from "../../../shared/common-modal/common-modal";

@Component({
    selector: 'app-teacher-modal',
    imports: [CommonModal],
    templateUrl: './teacher-modal.html',
    styleUrls: ['./teacher-modal.scss'],
})
export class TeacherModal {
    isOpenSignal = signal<boolean>(false)
    @Input() isOpen = this.isOpenSignal();
    roleList = signal([
        { value: 'TEACHER', label: 'Professor' },
        { value: 'HEADTEACHER', label: 'Coordenador' }
    ]);
    @Output() close = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<{ name: string; url: string }>();

    name = signal('');
    birth = signal('');
    email = signal('');
    company = signal('');
    role = signal('');

    closeModal(): void {
        this.close.emit();
    }

    confirmModal(): void {
        const request = {
            name: this.name(),
            email: this.email(),
            birth: this.birth(),
            role: this.role()
        };
        console.log(request)
        this.close.emit();
    }

}