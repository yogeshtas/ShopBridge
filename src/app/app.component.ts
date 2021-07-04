import { Component } from '@angular/core';
import {Router, NavigationEnd,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'smart-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'smartadmin-angular-seed';

  mySubscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute){
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.mySubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
    // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        }
      }); 
  }

  
  ngOnDestroy(){
    console.log('app ngOnDestroy')
    if (this.mySubscription) {
     this.mySubscription.unsubscribe();
    }
  }
}
