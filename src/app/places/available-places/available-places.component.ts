import { Component, signal, inject, OnInit, DestroyRef, } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { catchError, map, throwError } from 'rxjs';

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
  error = signal('');
  private httpClient = inject(HttpClient);
  private destoryRef = inject(DestroyRef);

  // constructors(private httpClient: HttpClient) {}

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.httpClient.get<{places: Place[] }>('http://localhost:3000/places').pipe(
      map((resData) => resData.places), catchError((error) => {
        console.log(error);
        return throwError(() => 
          new Error('something is not right (X_X), pleace try agian later')
      );
    })
  )
      .subscribe({
      next: (places) => {
        this.places.set(places);
      },
      error: (error:Error) => {
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destoryRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    this.httpClient.put('http://localhost:3000/user-places', {
      placeId: selectedPlace.id
    }).subscribe({
      next: (resData) => console.log(resData),
    });
  }
}
