import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAlertDialogComponent } from './delete-alert.component';

describe('ConfirmDialogComponent', () => {
  let component: DeleteAlertDialogComponent;
  let fixture: ComponentFixture<DeleteAlertDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeleteAlertDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
