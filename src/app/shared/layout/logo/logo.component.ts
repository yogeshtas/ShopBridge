import { Component } from '@angular/core';
import { ShortcutModalService } from '../shortcut-modal/shortcut-modal.service';
import { APP_CONFIG } from 'src/app/app.config';

@Component({
  selector: 'smart-logo',
  templateUrl: './logo.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {
  logo = APP_CONFIG.logo;
  appName = APP_CONFIG.appName;

  constructor(public shortcut: ShortcutModalService) {  
    console.log("In logo") 
    setInterval(() => {
      let head_logo = sessionStorage.getItem('header_icon');
      if(head_logo != null){
         this.logo = head_logo;
      }else{
         this.logo = APP_CONFIG.logo;
      }
    }, 100);
  }

  openShortcut($event: MouseEvent) {
    $event.preventDefault();
    this.shortcut.openModal();

  }

}
