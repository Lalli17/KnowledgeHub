import { Routes } from '@angular/router';

// Import all the components
import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { Register } from './pages/register/register';
import { BrowseUrls } from './pages/browse-urls/browse-urls';
import { SubmitUrl } from './pages/submit-url/submit-url';
import { ListCategories } from './pages/list-categories/list-categories';
import { Category } from './pages/category/category';
import { ApproveUrlsComponent } from './pages/approve-urls/approve-urls';
import { ListUsers } from './pages/list-users/list-users';

// Import the functional guards we prepared
import { authGuard, adminGuard } from './services/auth.guard';

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
  { path: 'category', component: Category, canActivate: [adminGuard] },
  { path: 'list-categories', component: ListCategories, canActivate: [adminGuard] },
  { path: 'approve-urls', component: ApproveUrlsComponent, canActivate: [adminGuard] },
  { path: 'list-users', component: ListUsers, canActivate: [adminGuard] },

  // Fallback route for any unknown paths
  { path: '**', redirectTo: '' }
];