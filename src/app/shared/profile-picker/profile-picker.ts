import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  AfterViewInit,
  viewChild,
  signal,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { LogicalSize } from '@tauri-apps/api/dpi';
import { ProfileItemComponent } from './components/profile-item/profile-item';
import { AccountToggleComponent } from './components/account-toggle/account-toggle.component';
import { OfflineAuthComponent } from './components/auth/offline-auth/offline-auth.component';
import { MicrosoftAuthComponent } from './components/auth/microsoft-auth/microsoft-auth.component';
import { ProfileMenuStore } from './store/profile-menu.store';

@Component({
  selector: 'al-profile-picker',
  standalone: true,
  templateUrl: 'profile-picker.html',
  styleUrls: ['profile-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProfileItemComponent,
    AccountToggleComponent,
    OfflineAuthComponent,
    MicrosoftAuthComponent,
  ],
})
export class ProfilePickerComponent implements AfterViewInit {
  readonly profileMenu = viewChild<ElementRef<HTMLElement>>('profileMenu');
  private readonly cdr = inject(ChangeDetectorRef);
  protected profileMenuStore = inject(ProfileMenuStore);

  async resize() {
    this.cdr.detectChanges();

    const defaultSize = new LogicalSize(500, 500);

    this.profileMenuStore.setSize(defaultSize);

    setTimeout(async () => {
      const container = this.profileMenu();

      if (container && container.nativeElement) {
        const element = container.nativeElement;
        const width = Math.ceil(element.offsetWidth);
        const height = Math.ceil(element.offsetHeight);

        if (width === 0 || height === 0) {
          return;
        }

        const newSize = new LogicalSize(width, height);

        this.profileMenuStore.setSize(newSize);

        this.cdr.markForCheck();
      }
    }, 0);
  }

  async ngAfterViewInit() {
    await this.resize();
  }

  // linkAccounts(): void {
  //   console.log('Запрос на привязку аккаунтов');
  // }

  // logout(): void {
  //   console.log('Выход из аккаунта');
  // }

  // selectProfile(): void {
  //   console.log('Выбор профиля');
  // }
}
