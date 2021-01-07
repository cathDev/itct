import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreleveurComponent } from './preleveur.component';

describe('PreleveurComponent', () => {
  let component: PreleveurComponent;
  let fixture: ComponentFixture<PreleveurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreleveurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreleveurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
