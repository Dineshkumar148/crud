import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConfirmationAlertComponent } from './update-confirmation-alert.component';

describe('UpdateConfirmationAlertComponent', () => {
  let component: UpdateConfirmationAlertComponent;
  let fixture: ComponentFixture<UpdateConfirmationAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateConfirmationAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateConfirmationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
