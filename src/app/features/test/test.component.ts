import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { VersionStore } from '../../core/version/version.store';

@Component({
  selector: 'al-test',
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  // 1. Внедряем Стор версий
  versionStore = inject(VersionStore);

  // 2. Внедряем триггер обновления интерфейса для Zoneless
  private cdr = inject(ChangeDetectorRef);

  /**
   * Инициализируем загрузку версий при старте компонента
   */
  async ngOnInit() {
    await this.versionStore.loadVersions();
    // Принудительно заставляем Angular перерисовать шаблон после асинхронного ответа от Rust
    this.cdr.detectChanges();
  }

  /**
   * Метод для ручного обновления (вызывается при клике на кнопку в HTML)
   */
  async refreshVersions() {
    await this.versionStore.loadVersions();
    // Принудительно заставляем Angular перерисовать шаблон
    this.cdr.detectChanges();
  }
}
