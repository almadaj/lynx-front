import {
    Component,
    OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-edit-member',
    standalone: true,
    imports: [
        FormsModule,
    ],
    templateUrl: './edit-member.html',
    styleUrls: ['./edit-member.scss']
})
export class EditMember implements OnInit {
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('userId');
        // TODO: atenção aqui, acredito q o ideal seja renderizar userCompanyId,
        // já q role não está no usuário, 
    }

    handleBackButton(): void {
        this.router.navigate(['/my-company'])
    }
}
