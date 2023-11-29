import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultigameComponent } from './multigame.component';

describe('MultigameComponent', () => {
  let component: MultigameComponent;
  let fixture: ComponentFixture<MultigameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultigameComponent]
    });
    fixture = TestBed.createComponent(MultigameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
