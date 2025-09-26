import { Routes } from '@angular/router';

// Import all the components
import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { Register } from './pages/register/register';
import { BrowseUrls } from './pages/browse-urls/browse-urls';
import { SubmitUrlComponent as SubmitUrl } from './pages/submit-url/submit-url';
import { ListCategories } from './pages/list-categories/list-categories';
import { category } from './pages/category/category';
import { ApproveUrlsComponent } from './pages/approve-urls/approve-urls';
import { ListUsers } from './pages/list-users/list-users';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

// Import the functional guards
import { authGuard, adminGuard, redirectAdminFromHomeGuard } from './services/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: '', component: Home, canActivate: [redirectAdminFromHomeGuard] },
  { path: 'browse', component: BrowseUrls },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },

  // Routes that require a user to be logged in

  { path: 'submit', component: SubmitUrl, canActivate: [authGuard] },

  // Admin routes
  { path: 'approve-urls', component: ApproveUrlsComponent, canActivate: [adminGuard] },
  { path: 'list-users', component: ListUsers, canActivate: [adminGuard] },
  { path: 'category', component: category },
  { path: 'category/list', component: ListCategories, canActivate: [adminGuard] },
  { path: 'category/list/edit/:id', component: category, canActivate: [adminGuard] },

  // Dashboard route for review & notifications
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },

  // Fallback route for unknown paths
  { path: '**', redirectTo: '' }
];
