import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultsDialogComponent } from './defaults-dialog.component';

describe('DefaultsDialogComponent', () => {
  let component: DefaultsDialogComponent;
  let fixture: ComponentFixture<DefaultsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
