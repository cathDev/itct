import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatVaccinComponent } from './resultat-vaccin.component';

describe('ResultatVaccinComponent', () => {
  let component: ResultatVaccinComponent;
  let fixture: ComponentFixture<ResultatVaccinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultatVaccinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatVaccinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
