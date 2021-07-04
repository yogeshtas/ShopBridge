import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { mobileNavigation } from 'src/app/store/navigation';
import { APP_CONFIG } from 'src/app/app.config';

@Component({
  selector: 'smart-page-header',
  templateUrl: './page-header.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {

  userType = sessionStorage.getItem('appType')
  avatar = APP_CONFIG.avatar;
  email = APP_CONFIG.email;
  user = APP_CONFIG.user;
  disableBtn;

  org_location = location.origin.split(":");
  hmi_url;

  constructor(private store: Store<any>) { 
    this.hmi_url  = this.org_location[0]+":"+this.org_location[1]+":8102";
    if(this.userType === "GrafanaUser"){
      this.disableBtn = false
    }else{
      this.disableBtn = true
    }
  }

  openMobileNav($event: MouseEvent) {
    console.log(JSON.stringify($event));
    $event.preventDefault();
    this.store.dispatch(mobileNavigation({open: true}));
  }

}
