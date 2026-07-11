import { AfterViewInit, ChangeDetectionStrategy, Component, input, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { MinecraftHeadComponent } from '../minecrfat-head/minecraft-head.component';

@Component({
  selector: 'al-profile-item',
  standalone: true,
  templateUrl: 'profile-item.html',
  styleUrls: ['profile-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MinecraftHeadComponent],
})
export class ProfileItemComponent {
  readonly status = input<boolean>(false);
  readonly name = input<string>('Test');
  readonly type = input<ProfileType>('offline');

  selectProfile() {}
}
