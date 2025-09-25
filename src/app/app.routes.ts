import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import all the components
import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { Register } from './pages/register/register';
import { BrowseUrls } from './pages/browse-urls/browse-urls';
import { SubmitUrl } from './pages/submit-url/submit-url';
import { ListCategories } from './pages/list-categories/list-categories';
import { category } from './pages/category/category';
import { ApproveUrlsComponent } from './pages/approve-urls/approve-urls';
import { ListUsers } from './pages/list-users/list-users';

// Import the functional guards we prepared
import { authGuard, adminGuard } from './services/auth.guard';
import { FormsModule } from '@angular/forms';

// This is the correct, modern way to define and export the routes array
export const routes: Routes = [
  // Public routes
  { path: '', component: Home },
  { path: 'browse', component: BrowseUrls },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },

  // Routes that require a user to be logged in
  { path: 'submit', component: SubmitUrl, canActivate: [authGuard] },

  // Routes that require a user to be an Admin
  { path: 'approve-urls', component: ApproveUrlsComponent, canActivate: [adminGuard] },
  { path: 'list-users', component: ListUsers, canActivate: [adminGuard] },
  { path: 'category', component: category },
  { path: 'category/list', component: ListCategories,canActivate: [adminGuard] },
  { path: 'category/list/edit/:id', component: category, canActivate: [adminGuard] },

  // Fallback route for any unknown paths
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}