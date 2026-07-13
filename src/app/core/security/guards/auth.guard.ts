import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AccountStore } from '../../account/account.store';

export const AuthGuard: CanActivateFn = () => {
  const accountStore = inject(AccountStore);

  return accountStore.hasAccount();
}
