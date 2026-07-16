import { Component, inject, input, output, signal } from '@angular/core';
import {NgIcon} from '@ng-icons/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'eh-form-select',
  imports: [NgIcon, CdkConnectedOverlay, CdkOverlayOrigin, NgTemplateOutlet],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
})
export class FormSelectComponent {
  label = input<string>();
  value = input.required<any>();
  icon = input<string>();
  options = input.required<{ label: string; value: any }[]>();
  error = input<string | null>();
  changed = output<{ label: string; value: any }>();
  private overlay = inject(Overlay);

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((v) => !v);
  }
  close() {
    this.isOpen.set(false);
  }

  select(option: any) {
    this.changed.emit(option);
    this.close();
  }

  readonly scrollStrategy = this.overlay.scrollStrategies.reposition({});
}
