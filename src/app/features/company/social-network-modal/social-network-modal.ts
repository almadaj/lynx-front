import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModal } from '../../../shared/common-modal/common-modal';
import { SocialNetworkService } from '../../../services/api-services/socialNetwork.service';
import { SocialNetworkResponseDTO } from '../../../models/socialNetwork';

@Component({
  selector: 'app-social-network-modal',
  imports: [CommonModal],
  templateUrl: './social-network-modal.html',
  styleUrls: ['./social-network-modal.scss'],
})
export class SocialNetworkModal {
  private socialNetworkService = inject(SocialNetworkService)

  isOpenSignal = signal<boolean>(false)
  socialNetworks = signal<SocialNetworkResponseDTO[]>([])
  @Input() isOpen = this.isOpenSignal();
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ name: string; url: string }>();

  name = signal('');
  url = signal('');

  fetchSocialNetworks(): void {
    this.socialNetworkService.listAll().subscribe({
      next: (data) => {
        this.socialNetworks.set(data)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  closeModal(): void {
    this.close.emit();
  }

  confirmModal = () => {
    //TODO: criar endpoints 
    console.log("enviei aqui")
  }
}
