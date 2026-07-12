import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { generateNickname } from '../../../../services/generate-nickname';
import { ProfileMenuStore } from '../../../store/profile-menu.store';

@Component({
  selector: 'al-offline-auth',
  standalone: true,
  templateUrl: 'offline-auth.component.html',
  styleUrls: ['offline-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  providers: [],
})
export class OfflineAuthComponent implements OnDestroy {
  ngOnDestroy(): void {
    const nickname = this.authForm.controls.nickname.value;
    this.profileMenuStore.saveDraftOfflineProfile({ nickname });
  }


  private readonly fb = inject(NonNullableFormBuilder);
  protected profileMenuStore = inject(ProfileMenuStore);

  readonly authForm = this.fb.group({
    nickname: [
      this.profileMenuStore.savedNewNickname(),
      [Validators.required, Validators.minLength(3), Validators.maxLength(16)],
    ],
  });

  // Потом ток при сенде показывать ошибки
  get error(): string | null {
    const control = this.authForm.controls.nickname;
    if (control.touched && control.invalid) {
      if (control.errors?.['required']) return 'Никнейм не может быть пустым';
      if (control.errors?.['minlength']) return 'Минимум 3 символа';
      if (control.errors?.['maxlength']) return 'Максимум 16 символов';
    }
    return null;
  }

  protected generateNickname() {
    this.authForm.controls.nickname.patchValue(generateNickname());
  }

  onSubmit() {
    if (this.authForm.valid) {
      const { nickname } = this.authForm.getRawValue();
      this.profileMenuStore.addNewProfile({
        nickname,
      });
    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
