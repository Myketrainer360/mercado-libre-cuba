import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAnnuncioComponent } from './card-annuncio.component';

describe('CardAnnuncioComponent', () => {
  let component: CardAnnuncioComponent;
  let fixture: ComponentFixture<CardAnnuncioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAnnuncioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAnnuncioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
