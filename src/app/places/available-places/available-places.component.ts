import { Component, signal, inject, OnInit, DestroyRef, } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false)
  private httpClient = inject(HttpClient);
  private destoryRef = inject(DestroyRef);

  // constructors(private httpClient: HttpClient) {}

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.httpClient.get<{places: Place[] }>('http://localhost:3000/places').pipe(
      map((resData) => resData.places)
    ).subscribe({
      next: (places) => {
        this.places.set(places);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destoryRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
