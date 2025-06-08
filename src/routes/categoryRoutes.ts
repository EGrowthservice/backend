import express from 'express';
import { CategoryController } from '../controllers/categoryController';

const router = express.Router();
const categoryController = new CategoryController();

router.post('/', (req, res) => categoryController.createCategory(req, res));
router.get('/', (req, res) => categoryController.getCategories(req, res));
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));
router.put('/:id', (req, res) => categoryController.updateCategory(req, res));
router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res));

export default router;