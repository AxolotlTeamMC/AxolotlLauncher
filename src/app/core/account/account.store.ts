import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AccountState, LowAccount } from './account.types';
import { AccountApiService } from './account-api.service';

const initialState: AccountState = {
  accountList: [],
  activeAccountUuid: '',
};

export const AccountStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    hasAccount: computed(() => store.accountList.length > 0),
    accountCount: computed(() => store.accountList.length),
    getActiveAccount: computed(() => {
      const activeUuid = store.activeAccountUuid();
      const list = store.accountList();
      return list.find((u) => u.uuid === activeUuid) || null;
    }),
    inactiveAccounts: computed(() => {
      const activeUuid = store.activeAccountUuid();
      const list = store.accountList();
      return list.filter((account) => account.uuid !== activeUuid);
    }),
  })),
  withMethods((store, accountApiService = inject(AccountApiService)) => ({
    loadAccounts() {
      accountApiService.fetchAccountsFromDisk().subscribe({
        next: (accountData) => {
          patchState(store, {
            accountList: accountData.accounts,
            activeAccountUuid: accountData.activeUuid,
          });
        },
        error: (e) => {
          console.error(`[withTauriWindow] Error Fetch Accounts:`, e);
        },
      });
    },

    saveAccount(account: LowAccount) {
      accountApiService.addAccount(account).subscribe({
        next: (accountData) => {
          console.log(accountData);
          patchState(store, {
            accountList: accountData.accounts,
            activeAccountUuid: accountData.activeUuid,
          });
        },
        error: (e) => {
          console.error(`[withTauriWindow] Error Fetch Accounts:`, e);
        },
      });
    },

    setActiveAccountUuid(accountUuid: string) {
      const list = store.accountList();

      const accountExist = list.some((u) => u.uuid === accountUuid);

      if (accountExist) {
        accountApiService.setActiveAccount(accountUuid).subscribe({
          next: (accountData) => {
            console.log("Данные с бека");
            console.log(accountData);
            patchState(store, {
              accountList: accountData.accounts,
              activeAccountUuid: accountData.activeUuid,
            });
          },
          error: (e) => {
            console.error(`[withTauriWindow] Error Fetch Accounts:`, e);
          },
        });

        patchState(store, {
          activeAccountUuid: accountUuid,
        });
      }
    },

    removeAccount(accountUuid: string) {
      const activeUuid = store.activeAccountUuid();
      const list = store.accountList();

      const accountExist = list.some((u) => u.uuid === accountUuid);
      const isActiveAccount = activeUuid == accountUuid;

      if (accountExist) {
        accountApiService.removeAccount(accountUuid);
      }
      if (isActiveAccount) {
        patchState(store, {
          activeAccountUuid: list[0].uuid || '',
        });
      }
    },
  })),
  withHooks((store) => ({
    onInit() {
      store.loadAccounts();
    },
  })),
);
