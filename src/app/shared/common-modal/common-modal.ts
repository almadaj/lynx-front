import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Type
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-common-modal',
  imports: [NgComponentOutlet],
  templateUrl: './common-modal.html',
  styleUrl: './common-modal.scss',
})
export class CommonModal {
  @Input() isOpen = false;
  @Input() title = 'Lynx';

  @Input() showFooter = true;
  @Input() showClose = true;

  @Input() showCancel = true;
  @Input() showConfirm = true;
  @Input() cancelButtonText = 'Cancelar';
  @Input() confirmButtonText = 'Confirmar';

  @Input() content = '';
  @Input() contentComponent: Type<unknown> | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.isOpen) {
      this.onClose();
    }
  }

  onOverlayClick(): void {
    if (this.isOpen) {
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
