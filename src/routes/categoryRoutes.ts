import express from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authenticate } from '../middleware/authMiddleware';
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files (PNG, JPG, GIF) are allowed'));
        }
        cb(null, true);
    },
});

const router = express.Router();
const categoryController = new CategoryController();

router.post('/', authenticate, categoryController.createCategory.bind(categoryController));
router.post('/:id/image', authenticate, upload.single('image'), categoryController.uploadCategoryImage.bind(categoryController));
router.get('/', categoryController.getCategories.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));
router.put('/:id', authenticate, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', authenticate, categoryController.deleteCategory.bind(categoryController));

export default router;