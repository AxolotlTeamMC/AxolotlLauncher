import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Subject, takeUntil } from 'rxjs';
import { GeneralSettingComponent } from './components/general-setting/general-setting.component';
import { CdkScrollable } from '@angular/cdk/overlay';

@Component({
  selector: 'al-settings-modal',
  standalone: true,
  templateUrl: 'settings.modal.html',
  styleUrls: ['settings.modal.scss'],
  imports: [GeneralSettingComponent, CdkScrollable],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsModalComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(DialogRef<boolean>);
  private readonly destroy$ = new Subject<void>();

  readonly isClosing = signal(false);
  readonly currentSetting = signal<SettingsTab>('general');

  ngOnInit(): void {
    this.dialogRef.outsidePointerEvents
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: MouseEvent) => {
        this.close();
      });
  }

  @HostListener('document:keydown.escape')
  onEscapeKeydown() {
    this.close();
  }
  close(): void {
    if (this.isClosing()) return;

    this.isClosing.set(true);

    setTimeout(() => {
      this.dialogRef.close(false);
    }, 200);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setSettingsTab(item: SettingsTab): void {
    this.currentSetting.update(() => item);
  }

  protected readonly javaVersions = javaVersions;
}

export type SettingsTab = 'general' | 'java_installations' | 'instance' | 'customize';

export const javaVersions = ['25', '21', '17', '8']
