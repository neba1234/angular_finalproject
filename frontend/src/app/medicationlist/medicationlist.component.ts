import { Component, effect, inject, signal } from '@angular/core';
import { MedicationService } from './medication.service';
import { JsonPipe } from '@angular/common';
import { MedicationComponent } from './medication.component';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-medicationlist',
  standalone: true,
  imports: [JsonPipe, MedicationComponent, MatChipsModule],
  template: `
    <div class="medication-list-container">
      <div class="header">Browse Medications</div>
      <div class="alphabet-container">
        <mat-chip-set>
          @for(letter of letters;track letter){
          <mat-chip (click)="getChar($event)" class="alphabet-chip">{{
            letter
          }}</mat-chip>
          }
        </mat-chip-set>
      </div>
      <div class="medications-container">
        @for(medication of medications();track medication){
        <app-medication [medication]="medication"> </app-medication>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .medication-list-container {
        max-width: 960px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      .header {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
      }

      .alphabet-container {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 20px;
      }

      .alphabet-chip {
        margin: 5px;
        padding: 10px;
        background-color: #f1f1f1;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .alphabet-chip:hover {
        background-color: #e0e0e0;
      }

      .alphabet-chip:active {
        background-color: #d1d1d1;
      }

      .medications-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      app-medication {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #fafafa;
        transition: background-color 0.3s ease;
      }

      app-medication:hover {
        background-color: #f0f0f0;
      }
    `,
  ],
})
export class MedicationlistComponent {
  char = signal('A');
  medications_service = inject(MedicationService);
  medications = this.medications_service.medications;
  letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  getChar(event: any) {
    const char = event.target.innerText;
    this.char.set(char);
  }

  constructor() {
    effect(() => {
      this.medications_service.getmedications(this.char());
    });
  }
}
