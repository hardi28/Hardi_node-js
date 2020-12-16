import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminviewleaveComponent } from './adminviewleave.component';

describe('AdminviewleaveComponent', () => {
  let component: AdminviewleaveComponent;
  let fixture: ComponentFixture<AdminviewleaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminviewleaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminviewleaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
