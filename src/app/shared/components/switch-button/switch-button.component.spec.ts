import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchButtonComponent } from './switch-button.component';

describe('SwitchButton', () => {
  let component: SwitchButtonComponent;
  let fixture: ComponentFixture<SwitchButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
