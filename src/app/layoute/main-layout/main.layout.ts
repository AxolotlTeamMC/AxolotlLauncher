import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { getCurrentWebviewWindow, WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { UnlistenFn } from '@tauri-apps/api/event';
import { PhysicalSize } from '@tauri-apps/api/dpi';
import { ProfileMenuStore } from '../../shared/profile-picker/store/profile-menu.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: 'main.layout.html',
  styleUrls: ['main.layout.scss'],
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit, OnDestroy {
  readonly isMaximized = signal<boolean>(true);
  private tauriWindow = getCurrentWebviewWindow();
  private unlistenResize: UnlistenFn | null = null;
  private unlistenMove: UnlistenFn | null = null;

  protected profileMenuStore = inject(ProfileMenuStore);

  async onClose(): Promise<void> {
    await this.tauriWindow.close().catch((e) => console.error(e));
  }

  async onMinMax(): Promise<void> {
    const isMaximized = await this.tauriWindow.isMaximized();
    if (isMaximized) {
      await this.tauriWindow.unmaximize();
      this.isMaximized.set(false);
    } else {
      await this.tauriWindow.maximize();
      this.isMaximized.set(true);
    }
  }

  async onMinimize(): Promise<void> {
    await this.tauriWindow.minimize().catch((e) => console.error(e));
  }

  async ngOnInit(): Promise<void> {
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    const maximizedStatus = await this.tauriWindow.isMaximized();
    this.isMaximized.set(maximizedStatus);

    this.unlistenResize = await this.tauriWindow.onResized(async () => {
      const currentStatus = await this.tauriWindow.isMaximized();
      this.isMaximized.set(currentStatus);
    });

    this.unlistenMove = await this.tauriWindow.onMoved(() => {
      if (this.profileMenuStore.isOpen()) {
        this.profileMenuStore.close();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.unlistenResize) this.unlistenResize();
    if (this.unlistenMove) this.unlistenMove();
  }

  async onProfileMenu(targetElement: HTMLElement): Promise<void> {
    this.profileMenuStore.toggleMenu(targetElement);
  }

  protected onSettings() {

  }

  protected onHomePage() {

  }

  protected onSkinPage() {

  }

  protected OnInstancesPage() {

  }

  protected onServerPage() {

  }

  protected OnHelper() {

  }

  protected onOtherMenu() {

  }
}
