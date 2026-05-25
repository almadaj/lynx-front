import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModal } from '../../../shared/common-modal/common-modal';
import { SocialNetworkService } from '../../../services/api-services/socialNetwork.service';
import { SocialNetworkRequestDTO, SocialNetworkResponseDTO } from '../../../models/socialNetwork';
import { CompanySocialNetworkService } from '../../../services/api-services/companySocialNetwork.service';

@Component({
  selector: 'app-social-network-modal',
  imports: [CommonModal],
  templateUrl: './social-network-modal.html',
  styleUrls: ['./social-network-modal.scss'],
})
export class SocialNetworkModal {
  private socialNetworkService = inject(SocialNetworkService)
  private companySocialNetworkService = inject(CompanySocialNetworkService)

  isOpenSignal = signal<boolean>(false)
  socialNetworks = signal<SocialNetworkResponseDTO[]>([])
  @Input() isOpen = this.isOpenSignal();
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<{ name: string; url: string }>();

  name = signal('');
  url = signal('');

  ngOnInit(): void {
    this.fetchSocialNetworks();
  }

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

  confirmModal(): void {
    const data: SocialNetworkRequestDTO = { socialNetworkId: this.name(), url: this.url() };
    console.log(this.name(), this.url())
    this.companySocialNetworkService.addSocialToCompany('e219b846-804f-44a3-8bbb-237b9c2c5ef0', data).subscribe({
      next: () => this.closeModal(),
      error: (err) => console.log(err),
    });
  }
}
