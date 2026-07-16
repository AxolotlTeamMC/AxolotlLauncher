import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MinecraftHeadComponent } from '../minecrfat-head/minecraft-head.component';
import { AccountType } from '../../../../core/account/account.types';
import { ProfileMenuStore } from '../../store/profile-menu.store';
import { AccountStore } from '../../../../core/account/account.store';

@Component({
  selector: 'al-profile-item',
  standalone: true,
  templateUrl: 'profile-item.html',
  styleUrls: ['profile-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MinecraftHeadComponent],
})
export class ProfileItemComponent {
  readonly id = input<string>('');
  readonly active = input<boolean>(false);
  readonly type = input<AccountType>('Offline');
  readonly nickname = input<string>('');
  private accountStore = inject(AccountStore);

  selectProfile() {
    this.accountStore.setActiveAccountUuid(this.id());
  }

  removeProfile() {
    this.accountStore.removeAccount(this.id());
  }
}
