import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  AfterViewInit,
  viewChild,
  OnDestroy,
  signal,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { LogicalSize } from '@tauri-apps/api/dpi';
import { ProfileItemComponent } from './components/profile-item/profile-item';
import { AccountToggleComponent } from './components/account-toggle/account-toggle.component';
import { OfflineAuthComponent } from './components/auth/offline-auth/offline-auth.component';
import { MicrosoftAuthComponent } from './components/auth/microsoft-auth/microsoft-auth.component';

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
  readonly profileView = signal<ProfileMenuView>('list');
  readonly profileType = signal<ProfileType>('offline');
  private readonly cdr = inject(ChangeDetectorRef);

  async resize() {
    this.cdr.detectChanges();

    await this.customSize(500, 400);

    setTimeout(async () => {
      const container = this.profileMenu();

      if (container && container.nativeElement) {
        const element = container.nativeElement;
        const width = Math.ceil(element.offsetWidth);
        const height = Math.ceil(element.offsetHeight);

        if (width === 0 || height === 0) {
          return;
        }
        await this.customSize(width, height);

        this.cdr.markForCheck();
      }
    }, 0);
  }

  async customSize(width: number, height: number) {
    const popup = await WebviewWindow.getByLabel('profile_picker_window');
    if (popup) {
      const newSize = new LogicalSize(width, height);
      await popup.setSize(newSize);
    }
  }

  async ngAfterViewInit() {
    await this.resize();
  }

  linkAccounts(): void {
    console.log('Запрос на привязку аккаунтов');
  }

  logout(): void {
    console.log('Выход из аккаунта');
  }

  selectProfile(): void {
    console.log('Выбор профиля');
  }

  async addNewProfile() {
    this.profileView.set('add-account');
    await this.resize();
  }

  async backToProfileList() {
    this.profileView.set('list');
    await this.resize();
  }

  protected handleTypeChange(type: ProfileType) {
    this.profileType.set(type);
  }
}
