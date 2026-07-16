import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SwitchButtonComponent } from '../../../../components/switch-button/switch-button.component';
import { FormSelectComponent } from '../../../../components/form-select/form-select';

@Component({
  selector: 'al-general-setting',
  standalone: true,
  templateUrl: 'general-setting.component.html',
  styleUrls: ['general-setting.component.scss'],
  imports: [SwitchButtonComponent, FormSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralSettingComponent {
  readonly items = signal<{ label: string; value: any }[]>([
    {
      label: 'Keep launcher open',
      value: 'Keep launcher open',
    },
    {
      label: 'Minimize to system tray',
      value: 'Minimize to system tray',
    },
    {
      label: 'Close launcher completely',
      value: 'Close launcher completely',
    },
  ]);
}
