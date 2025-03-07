import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnEjecucionPage } from './en-ejecucion.page';

describe('EnEjecucionPage', () => {
  let component: EnEjecucionPage;
  let fixture: ComponentFixture<EnEjecucionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnEjecucionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
