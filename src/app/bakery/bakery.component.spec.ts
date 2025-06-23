import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakeryComponent } from './bakery.component';

describe('BakeryComponent', () => {
  let component: BakeryComponent;
  let fixture: ComponentFixture<BakeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BakeryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BakeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
