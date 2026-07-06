import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Room } from './test.component';

describe('Room', () => {
  let component: Room;
  let fixture: ComponentFixture<Room>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Room],
    }).compileComponents();

    fixture = TestBed.createComponent(Room);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
