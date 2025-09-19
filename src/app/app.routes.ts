import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { BrowseUrls } from './pages/browse-urls/browse-urls';
import { SubmitUrl } from './pages/submit-url/submit-url';
import { ListCategories } from './pages/list-categories/list-categories';
import { Category} from './pages/category/category';
import { ApproveUrls } from './pages/approve-urls/approve-urls';
import { ListUsers } from './pages/list-users/list-users';
import { AuthService } from './services/auth';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'browse', component: BrowseUrls },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'submit', component: SubmitUrl, canActivate: [AuthService] },
  // Admin routes
  { path: 'category', component: Category, canActivate: [AuthService], data: { roles: ['A'] } },
  { path: 'list-categories', component: ListCategories, canActivate: [AuthService], data: { roles: ['A'] } },
  { path: 'approve-urls', component: ApproveUrls, canActivate: [AuthService], data: { roles: ['A'] } },
  { path: 'list-users', component: ListUsers, canActivate: [AuthService], data: { roles: ['A'] } },

  // fallback
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
