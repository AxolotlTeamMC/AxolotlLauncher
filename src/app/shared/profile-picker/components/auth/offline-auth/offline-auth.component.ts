import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { generateNickname } from '../../../../services/generate-nickname';

@Component({
  selector: 'al-offline-auth',
  standalone: true,
  templateUrl: 'offline-auth.component.html',
  styleUrls: ['offline-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [
  ]
})
export class OfflineAuthComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly label = signal<string>('Никнейм');
  readonly onLogin = output<string>();

  // Инициализация формы с валидацией
  readonly authForm = this.fb.group({
    nickname: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(16)
    ]]
  });

  // Геттер для моментального вывода ошибок валидации
  get error(): string | null {
    const control = this.authForm.controls.nickname;
    if (control.touched && control.invalid) {
      if (control.errors?.['required']) return 'Никнейм не может быть пустым';
      if (control.errors?.['minlength']) return 'Минимум 3 символа';
      if (control.errors?.['maxlength']) return 'Максимум 16 символов';
    }
    return null;
  }

  // Пустая функция для кнопки перезагрузки сбоку от поля
  protected onRefresh() {
    this.authForm.controls.nickname.patchValue(generateNickname());
  }

  // Отправка формы наверх родителю
  onSubmit() {
    if (this.authForm.valid) {
      const { nickname } = this.authForm.getRawValue();
      this.onLogin.emit(nickname);
    } else {
      this.authForm.markAllAsTouched();
    }
  }
}
