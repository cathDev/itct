import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MesResultatsComponent } from './mes-resultats.component';

describe('MesResultatsComponent', () => {
  let component: MesResultatsComponent;
  let fixture: ComponentFixture<MesResultatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MesResultatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MesResultatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
