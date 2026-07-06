import {Routes} from '@angular/router';
import {App} from './app';
import {TestComponent} from './features/test/test.component';
import {LayoutComponent} from './layoute/main-layout/main.layout';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: TestComponent }
    ]
  },
];
