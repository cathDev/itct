import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationVaccinComponent } from './validation-vaccin.component';

describe('ValidationVaccinComponent', () => {
  let component: ValidationVaccinComponent;
  let fixture: ComponentFixture<ValidationVaccinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationVaccinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationVaccinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
