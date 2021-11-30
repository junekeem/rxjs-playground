import { Component } from '@angular/core';
import { Subject, BehaviorSubject, ReplaySubject, Observable, share } from 'rxjs';

import { MeasureValuesService } from './measure-values.service';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'rxw-multicast',
  templateUrl: './multicast.component.html',
})
export class MulticastComponent {

  listeners: string[] = [];
  logStream$ = new ReplaySubject<string>();

  // 1.
  // measureValues$: Observable<number>; // später: Subject<number>;

  // 2.
  measureValues$: Subject<number>;


  constructor(private mvs: MeasureValuesService, private es: ExerciseService) {
    /**************!!**************/

    // 1. share takes already existing observable and distribute
    // this.measureValues$ = this.mvs.getValues().pipe(share()); // share(): Cold Observable(unicast) to Hot Observable(multicast)

    // 2. Subject just a role as a distributor
    // this.measureValues$ = new Subject();

    // this.mvs.getValues().subscribe(this.measureValues$);

    // Same as:
    // this.mvs.getValues().subscribe({
    //   next: e => this.measureValues$.next(e),
    //   error: e => this.measureValues$.error(e),
    //   complete: () => this.measureValues$.complete()
    // });

    // 3. BehaviorSubject can subscribe to the subject to receive the last (or initial) value and all subsequent notifications
    // this.measureValues$ = new BehaviorSubject(0);
    // this.mvs.getValues().subscribe(this.measureValues$);

    // 4. ReplaySubject: new subscriber immediately receives the last n values
    this.measureValues$ = new ReplaySubject(5);
    this.mvs.getValues().subscribe(this.measureValues$);

    /**************!!**************/

  }

  addListener() {
    this.listeners.push(this.es.generateRandomString());
  }

  addConsoleListener() {
    const randomString = this.es.generateRandomString();
    this.measureValues$.subscribe(e => this.logStream$.next(`${randomString} ${e}`));
  }

}
