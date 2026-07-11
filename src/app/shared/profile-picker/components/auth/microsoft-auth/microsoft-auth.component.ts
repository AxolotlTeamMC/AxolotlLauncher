import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'al-microsoft-auth',
  standalone: true,
  templateUrl: 'microsoft-auth.component.html',
  styleUrls: ['microsoft-auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class MicrosoftAuthComponent  {
  onSubmit() {
  }
}
