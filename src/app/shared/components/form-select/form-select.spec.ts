import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSelect } from './form-select';

describe('FormSelect', () => {
  let component: FormSelect;
  let fixture: ComponentFixture<FormSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSelect],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
