import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Type,
} from '@angular/core';
import { NgComponentOutlet, NgIf } from '@angular/common';

@Component({
  selector: 'app-common-modal',
  imports: [NgIf, NgComponentOutlet],
  templateUrl: './common-modal.html',
  styleUrl: './common-modal.scss',
})
export class CommonModal {
  @Input() isOpen = false;
  @Input() title = 'Modal';

  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showClose = true;

  @Input() showCancel = true;
  @Input() showConfirm = true;
  @Input() cancelButtonText = 'Cancelar';
  @Input() confirmButtonText = 'Confirmar';

  @Input() closeOnOverlayClick = true;
  @Input() closeOnEsc = true;
  @Input() contentType: 'text' | 'html' | 'component' = 'text';
  @Input() content = '';
  @Input() contentComponent: Type<unknown> | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen && this.closeOnEsc) {
      this.onClose();
    }
  }

  onOverlayClick(): void {
    if (this.closeOnOverlayClick) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

}
