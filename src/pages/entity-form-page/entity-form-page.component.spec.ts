import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityFormPageComponent } from './entity-form-page.component';

describe('EntityFormPageComponent', () => {
  let component: EntityFormPageComponent;
  let fixture: ComponentFixture<EntityFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityFormPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
