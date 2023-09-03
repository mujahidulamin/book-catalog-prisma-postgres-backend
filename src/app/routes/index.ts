import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { UserRoutes } from '../modules/user/user.routes';
import { CategoryRoutes } from '../modules/category/category.routes';
import { BookRoutes } from '../modules/book/book.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/books',
    route: BookRoutes,
  },
  // {
  //   path: '/orders',
  //   route: OrderRoutes,
  // },
  // {
  //   path: '/profile',
  //   route: ProfileRoutes,
  // },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
