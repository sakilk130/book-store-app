import { Request, Response } from 'express';
import Book from '../models/book';
import cloudinary from '../config/cloudinary';

const getBooks = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 2;
    const skip: number = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profile_image');
    const total = await Book.countDocuments();
    res.send({
      books,
      page,
      total_pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', data: null });
  }
};

const createBook = async (req: any, res: Response) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!image || !title || !caption || !rating) {
      return res
        .status(400)
        .json({ message: 'Please provide all fields', data: null });
    }
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;
    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });
    await newBook.save();
    return res
      .status(201)
      .json({ message: 'Book created successfully', data: newBook });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', data: null });
  }
};

const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const findBook = await Book.findById(id);

    if (!findBook) {
      return res.status(404).json({ message: 'Book not found', data: null });
    }

    if (findBook.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to delete this book',
        data: null,
      });
    }

    await findBook.deleteOne();
    return res
      .status(200)
      .json({ message: 'Book deleted successfully', data: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', data: null });
  }
};

const myBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    return res
      .status(200)
      .json({ message: 'Books retrieved successfully', data: books });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Internal server error', data: null });
  }
};

export { getBooks, createBook, deleteBook, myBooks };
