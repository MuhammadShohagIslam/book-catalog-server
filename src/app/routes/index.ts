import express, { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BookRoutes } from '../modules/book/book.route';


const router: Router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  
  {
    path: '/books',
    route: BookRoutes,
  }
 
];

moduleRoutes.forEach(mr => router.use(mr.path, mr.route));

export default router;
