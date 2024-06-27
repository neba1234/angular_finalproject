import { Injectable, inject, signal } from '@angular/core';
import { Medication } from '../types';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  medications = signal<Medication[]>([]);
  http = inject(HttpClient);
  getmedications(letter: string) {
    let array: Medication[] = [];
    return this.http
      .get<{ success: boolean; data: Medication[] }>(
        `http://localhost:3000/medications?first_letter=${letter}`
      )
      .subscribe((res) => {
        if (res.success) {
          for (let elem of res.data) {
            this.http
              .get<{ success: boolean; data: Medication }>(
                `http://localhost:3000/medications/${elem._id}`
              )
              .subscribe((response) => {
                if (response.success) {
                  array.push(response.data);
                }
              });
          }
          this.medications.set(array);
        }
      });
  }
}
