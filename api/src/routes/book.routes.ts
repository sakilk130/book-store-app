import express from 'express';
import {
  createBook,
  deleteBook,
  getBooks,
  myBooks,
} from '../controllers/book.controller';
import protectRoute from '../middlewares/auth.middleware';

const bookRoutes = express.Router();

bookRoutes.get('/', protectRoute, getBooks);

bookRoutes.post('/', protectRoute, createBook);

bookRoutes.get('/my-books', protectRoute, myBooks);
bookRoutes.delete('/:id', protectRoute, deleteBook);

export default bookRoutes;
