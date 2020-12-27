import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatTestComponent } from './resultat-test.component';

describe('ResultatTestComponent', () => {
  let component: ResultatTestComponent;
  let fixture: ComponentFixture<ResultatTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultatTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultatTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
