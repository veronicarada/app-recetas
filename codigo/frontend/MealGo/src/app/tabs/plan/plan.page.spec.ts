import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanPage } from './plan.page';

describe('TabsPage', () => {
  let component: PlanPage;
  let fixture: ComponentFixture<PlanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
