import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef, inject,
  output,
  signal,
  viewChild,
  viewChildren
} from '@angular/core';
import { ProfileMenuStore } from '../../store/profile-menu.store';
import { ProfileType } from '../../types/profile-picker.types';

@Component({
  selector: 'al-account-toggle',
  standalone: true,
  templateUrl: 'account-toggle.component.html',
  styleUrls: ['account-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class AccountToggleComponent {
  readonly activeItem = viewChild.required<ElementRef<HTMLElement>>('selector');
  readonly buttonItems = viewChildren<ElementRef<HTMLElement>>('toggleBtn');

  protected profileMenuStore = inject(ProfileMenuStore);

  constructor() {
    effect(() => {
      const type = this.profileMenuStore.currentType();
      this.syncActivePosition(type);
    });
  }

  selectTab(event: Event) {
    const button = event.currentTarget as HTMLButtonElement;
    const type = button.dataset['type'] as ProfileType;

    if (type) {
      this.profileMenuStore.changeProfileType(type);
    }
  }



  private syncActivePosition(type: ProfileType) {
    const buttons = this.buttonItems();
    const active = this.activeItem().nativeElement;

    const targetButton = buttons.find(
      btn => btn.nativeElement.getAttribute('data-type') === type
    )?.nativeElement;

    if (targetButton && active) {
      active.style.width = `${targetButton.offsetWidth - 1}px`;
      active.style.height = `${targetButton.offsetHeight}px`;
      active.style.transform = `translateX(${targetButton.offsetLeft - 2}px)`;
    }
  }
}
