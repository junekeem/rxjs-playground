import { Component } from '@angular/core';
import { ReplaySubject, throwError, of, EMPTY, retry, catchError, timer, from, Observable } from 'rxjs';

import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'rxw-error-handling',
  templateUrl: './error-handling.component.html',
})
export class ErrorHandlingComponent {

  logStream$ = new ReplaySubject<unknown>();

  constructor(private es: ExerciseService) { }

  /**
   * Das Observable aus `this.es.randomError()` liefert mit hoher Wahrscheinlichkeit einen Fehler.
   * Probiere verschiedene Strategien aus, um den Fehler zu behandeln:
   * - wiederholen
   * - Fehler weiterwerfen
   * - Fehler umwandeln (in ein normales Element)
   * - Fehler verschlucken/ignorieren
   */

  // TODO: Repeat request
  start() {
    this.es.randomError().pipe(

      /******************************/
      catchError(err => { // as a map, but handle error
        // Error Handling 1
        // Throw/Replace error:
        return throwError(() => 'Error!');

        // Error Handling 2
        // Set Fallback data (Replace error with normal data):
        // return of('Nothing', 'happened');

        // Error Handling 3
        // Ignore error:
        // return EMPTY;
        // return of()
        // return from([]);
        // return from(Promise.resolve());
        // return new Observable(obs => (obs));
      }),
      retry(3) // more information: https://blog.strongbrew.io/safe-http-calls-with-rxjs/

      /******************************/

    ).subscribe({
      next: e => this.logStream$.next(e),
      error: err => this.logStream$.next('❌ ERROR: ' + err)
    });
  }
}
