import { Component } from '@angular/core';
import { Subject, ReplaySubject, Observable, map, mergeAll, mergeMap, concatMap, switchMap, exhaustMap } from 'rxjs';

import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'rxw-higherorder',
  templateUrl: './higherorder.component.html',
})
export class HigherorderComponent {

  logStream$ = new ReplaySubject<string>();
  source$ = new Subject<string>();

  result$: Observable<string>;

  constructor(private es: ExerciseService) {

    /**
     * Löse für jedes Tier-Event im source$-Stream ein Echo aus.
     * Die Methode `this.es.echo()` gibt ein Observable zurück, das Echos produziert.
     * Probiere aus, wie sich concatMap, mergeMap, switchMap und exhaustMap unterschiedlich verhalten.
     *
     * Quelle: this.source$
     * Ziel:   this.result$
     */

    /**************!!**************/

    /**
     * Not recommended:
     */
    // this.source$.pipe(map(tier => this.es.echo(tier))
    // ).subscribe(e => {
    //   e.subscribe(data => {

    //   })
    // });

    /**
     * Use: map + merge
     */
    // this.result$ = this.source$.pipe(
    //   map(tier => this.es.echo(tier)),
    //   mergeAll()
    // );

    /**
     *  = mergeMap():
     *  Maps each value to each other of the observable
     *  and merges the results (in the order of their occurrence).
     */
    // this.result$ = this.source$.pipe(
    //   mergeMap(tier => this.es.echo(tier))
    // );

    /**
     * concatMap():
     * Maps each value to another observable,
     * but continues with the next observable only after the previous one is completed.
     */
    // this.result$ = this.source$.pipe(
    //   concatMap(tier => this.es.echo(tier))
    // );

    /**
     *  switchMap():
     *  Maps each value to another observable,
     *  but terminates the running Subscription as soon as a new value appears in the source stream;
     *  only the most recent value is important
     */
    // this.result$ = this.source$.pipe(
    //   switchMap(tier => this.es.echo(tier)));

    /**
     *  exhaustMap():
     *  Maps each value to another observable,
     *  but ignores all values from the source stream as long as a subscription is still running.
     */
    this.result$ = this.source$.pipe(
      exhaustMap(tier => this.es.echo(tier)));

    /**
     * concatMap() → if order is important (slower)
     * mergeMap() → if order is not important (faster)
     * switchMap() → if only the last value is interesting (e.g. TypeAhead)
     * exhaustMap() → if currently running process must be finished, before further proceeding (e.g. login)
     */

    /**************!!**************/

    this.source$.subscribe(value => this.logStream$.next(`SOURCE: ${value}`));
    this.result$.subscribe(value => this.logStream$.next(`🚀 ${value}`));
  }

  echoTest() {
    this.es.echo('TEST').subscribe(value => this.logStream$.next(value));
  }

  sendValue(value: string) {
    this.source$.next(value);
  }

}
