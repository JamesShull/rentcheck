import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSnackbarComponent } from './help-snackbar.component';

describe('HelpSnackbarComponent', () => {
  let component: HelpSnackbarComponent;
  let fixture: ComponentFixture<HelpSnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpSnackbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
