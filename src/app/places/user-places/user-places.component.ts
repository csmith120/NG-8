import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false)
  error = signal('');
  private httpClient = inject(HttpClient);
  private destoryRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.httpClient.get<{places: Place[] }>('http://localhost:3000/user-places').pipe(
      map((resData) => resData.places), catchError((error) => {
        console.log(error);
        return throwError(() => 
          new Error('Couldent find favorite places (X_X), pleace try agian later')
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
