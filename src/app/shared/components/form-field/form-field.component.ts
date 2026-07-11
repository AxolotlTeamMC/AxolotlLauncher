import {Component, contentChild, ElementRef, input, signal} from '@angular/core';
import {NgIcon} from '@ng-icons/core';

type InputType = 'static' | 'float' | 'inline' | 'inside';

@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
  imports: [
    NgIcon
  ],
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {
  label = input.required<string>();
  icon = input<string>();
  error = input<string | null>();
  isFilled = input<boolean>(false);
  isPassword = input<boolean>(false);
  inputType = input<InputType>('static');

  hidePassword = signal(true);

  inputElement = contentChild<ElementRef<HTMLInputElement>>('formInput');

  protected togglePassword() {
    this.hidePassword.update(v => !v);

    const input = this.inputElement();
    if (input) {
      input.nativeElement.type = this.hidePassword() ? 'password' : 'text';
    }
  }
}
