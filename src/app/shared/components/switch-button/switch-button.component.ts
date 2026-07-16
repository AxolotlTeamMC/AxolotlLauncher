import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'ui-switch-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './switch-button.component.html',
  styleUrl: './switch-button.component.scss',
})
export class SwitchButtonComponent {
  readonly isActive = signal(false);
  readonly click = output<void>();

  activeToggle() {
    this.isActive.update(u => !u);
    console.log(this.isActive());
    this.click.emit();
  }
}
