import express from 'express';
import { CategoryController } from './category.controller';

const router = express.Router();

router.post(
  '/create-category',
  CategoryController.createCategory
);

// router.get('/', CategoryController.getAllCategory);
// router.get(
//   '/:id',

//   CategoryController.getSingleCategory,
// );
// router.patch(
//   '/:id',
//   auth(ENUM_USER_ROLE.ADMIN),
//   CategoryController.updateSingleCategory,
// );
// router.delete(
//   '/:id',
//   auth(ENUM_USER_ROLE.ADMIN),
//   CategoryController.deleteSingleCategory,
// );
export const CategoryRoutes = router;
