import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './shared/layout/main/main.component';
import { LayoutModule } from './shared/layout/layout.module';
import { AuthComponent } from './shared/layout/auth/auth.component';
// import { AuthGuardService } from './core/services/auth/auth-guard.service';

const routes: Routes = [
 
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'inventory', pathMatch: 'full' },
      { path: 'inventory', loadChildren: () => import('./features/inventory/inventory.module').then(m => m.InventoryModule) },
     
    ]
  },
];

@NgModule({
  imports: [LayoutModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
