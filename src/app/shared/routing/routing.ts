import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../../home/home.component';
import { AppComponent } from '../../../app/app.component';

const appRoutes: Routes = [
	{path: '', component: HomeComponent}
]

export const AppRouting = RouterModule.forRoot(appRoutes)