import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {defaultWindowIcon} from '@tauri-apps/api/app';
import {getCurrentWindow} from '@tauri-apps/api/window';
import {UnlistenFn} from '@tauri-apps/api/event';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: 'main.layout.html',
  styleUrls: ['main.layout.scss'],
  providers: [],
  imports: [
    RouterOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit, OnDestroy {
  readonly isMaximized = signal<boolean>(true)
  private tauriWindow = getCurrentWindow();
  private unlistenResize: UnlistenFn | null = null;

  async onClose() {
    await this.tauriWindow.close();
  }

  async onMinMax(): Promise<void> {
    const isMaximized = await this.tauriWindow.isMaximized();
    console.log(isMaximized);
    if (isMaximized) {
      await this.tauriWindow.unmaximize();
      this.isMaximized.set(false);
    } else {
      await this.tauriWindow.maximize();
      this.isMaximized.set(true);
    }
  }

  async onMinimize() {
    await this.tauriWindow.minimize();
  }

  async onProfile() {

  }

  async ngOnInit() {
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    this.isMaximized.set(await this.tauriWindow.isMaximized())

    this.unlistenResize = await this.tauriWindow.onResized(async () => {
      const currentStatus = await this.tauriWindow.isMaximized();
      this.isMaximized.set(currentStatus);
    });
  }

  ngOnDestroy(): void {
    if (this.unlistenResize) {
      this.unlistenResize();
    }
  }
}
