import {Component, inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter, map} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'eh-breadcrumb',
  imports: [
  ],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class BreadcrumbComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly breadcrumbs = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let activeRoute = this.route.root;
        while (activeRoute.firstChild) activeRoute = activeRoute.firstChild;

        const data = activeRoute.snapshot.data['breadcrumbs'] || [];
        const params = activeRoute.snapshot.params;

        return data.map((bc: { label: string, url: string }) => ({
          ...bc,
          url: Object.keys(params).reduce(
            (url, key) => url.replace(`:${key}`, params[key]),
            bc.url
          )
        }));
      })
    ),
    { initialValue: [] }
  );
}
