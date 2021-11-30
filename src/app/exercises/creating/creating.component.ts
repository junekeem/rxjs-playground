import { Component } from '@angular/core';
import { Observable, of, from, timer, interval, ReplaySubject, map, filter } from 'rxjs';

@Component({
  selector: 'rxw-creating',
  templateUrl: './creating.component.html',
})
export class CreatingComponent {

  logStream$ = new ReplaySubject<string | number>();

  constructor() {
    /**
     * 1. Erstelle ein Observable und abonniere den Datenstrom.
     *    Probiere dazu die verschiedenen Creation Functions aus: of(), from(), timer(), interval()
     * 2. Implementiere außerdem ein Observable manuell, indem du den Konstruktor "new Observable()" nutzt.
     *
     * Tipps:
     * Zum Abonnieren kannst du einen (partiellen) Observer oder ein einzelnes next-Callback verwenden.
     * Du kannst die Methode this.log() verwenden, um eine Ausgabe in der schwarzen Box im Browser zu erzeugen.
     */

    /******************************/

    function producer(o: any) {
      o.next(5);
      o.next(4);
      o.next(3);

      setTimeout(()=> {
        o.next(2);
      }, 1000);

      setTimeout(()=> {
        o.error('error');
      }, 2000);
    }

    const observer = {
      next: (e: any) => console.log(e),
      error: (e: any) => console.error(e),
      complete: () => console.log('complete')
    };

    // 2.
    const myObs$ = new Observable(producer); // $: Finnische Notation - Andre Staltz
    // same as:
    // const myObs1$ = new Observable((o) => {
    //   o.next('demo');
    // });

    // myObs$.subscribe(e => console.log(e), err => console.log(err));
    myObs$.subscribe(observer);

    // 1.
    // producer(obs);

    // Example:
    /*
    class MyObservable {
      constructor(private producer: any) {}

      subscribe(observer) {
        const subscriber = this.sanitizeObserver(observer);
        this.producer(subscriber);
      }
    }
    */

    /******************************/
  }

  private log(msg: string | number) {
    this.logStream$.next(msg);
  }

}
