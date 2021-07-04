import { Component } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2'

@Component({
  selector: 'smart-dropdown-user',
  templateUrl: './dropdown-user.component.html',
})
export class DropdownUserComponent {

  // user = {
  //   app: 'SmartAdmin',
  //   name: 'Dr. Codex Lantern',
  //   email: 'drlantern@gotbootstrap.com',
  //   avatar: 'avatar-admin.png',
  // };
    savedLogo;
    user = {
    app: 'Advait',
    name: sessionStorage.getItem('firstName'),
    email: sessionStorage.getItem('email'),
    role: sessionStorage.getItem('role'),
    avatar: 'avatar-m.png',
  };

  constructor(private router: Router,
  ) { }

  Logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout from the application!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout please!',
      cancelButtonText: 'No, cancel!'
    }).then((result) => {
      // console.log("#########: "+JSON.stringify(result));
      if (result.value) {
        this.savedLogo = sessionStorage.getItem('header_icon');
        
        sessionStorage.clear();
        if(this.savedLogo === "mini_advait.png") sessionStorage.setItem('header_icon', this.savedLogo)
        this.router.navigate(['']);

        setTimeout(function () { 
          window.location.reload(); 
        }, 200);
      }
    });
  }

}
