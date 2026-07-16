import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, OnDestroy, viewChild } from '@angular/core';
import { LogicalSize } from '@tauri-apps/api/dpi';
import { ProfileMenuStore } from './store/profile-menu.store';
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
export class ProfilePickerComponent implements OnInit, OnDestroy {
  readonly profileMenu = viewChild.required<ElementRef<HTMLElement>>('profileMenu');

  protected readonly profileMenuStore = inject(ProfileMenuStore);

  private layoutObserver: ResizeObserver | null = null;

  ngOnInit(): void {
    requestAnimationFrame(() => {
      this.initAutoResizing();
    });
  }

  /**
   * Запускает непрерывное автоматическое отслеживание геометрии контента
   */
  private initAutoResizing(): void {
    const element = this.profileMenu().nativeElement;

    this.layoutObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.target.getBoundingClientRect();

        const width = Math.ceil(rect.width);
        const height = Math.ceil(rect.height);

        if (height === 0) return;

        this.profileMenuStore.setSize(new LogicalSize(width, height));
      }
    });

    this.layoutObserver.observe(element);
  }

  ngOnDestroy(): void {
    if (this.layoutObserver) {
      this.layoutObserver.disconnect();
    }
  }
}
