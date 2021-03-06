import { Component, OnDestroy } from '@angular/core';
import { Subject, ReplaySubject, timer, Subscription, takeWhile, takeUntil } from 'rxjs';

@Component({
  selector: 'rxw-unsubscribe',
  templateUrl: './unsubscribe.component.html',
})
export class UnsubscribeComponent implements OnDestroy {

  logStream$ = new ReplaySubject<string | number>();

  /**
   * Öffne die Browser-Console: Dort siehst Du den Output eines Observables, das jede Sekunde einen Wert generiert.
   * Navigiere zurück auf die Startseite und beobachte die Console:
   * Die Subscription läuft weiter. Wir haben einen klassischen Memory Leak erzeugt...
   *
   * Sorge dafür, dass die Subscription in der Methode ngOnDestroy() beendet wird!
   * Sie wird beim Buttonklick und beim Wegnavigieren ausgelöst.
   *
   * Es gibt noch weitere Wege, das Problem zu lösen...
   */

  // private sub = new Subscription; // Not recommended
  private destroy$ = new Subject<void>();

  constructor() {
    const interval$ = timer(0, 1000);

    // this.sub = Not recommended
    interval$.pipe(

      /******************************/

      // take(n): sets the number of observable from
      // takeUntil():
      // takeUntil(timer(4200))
      takeUntil(this.destroy$)

      /******************************/

    ).subscribe({
      next: e => this.log(e),
      error: err => this.log('❌ ERROR: ' + err),
      complete: () => this.log('✅ COMPLETE')
    });
  }

  ngOnDestroy() {
    // this.sub.unsubscribe(); // Not recommended
    this.destroy$.next();

    this.logStream$.next('DESTROY');
  }

  log(msg: string | number) {
    console.log(msg);
    this.logStream$.next(msg);
  }
}
