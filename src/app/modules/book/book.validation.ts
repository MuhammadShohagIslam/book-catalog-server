import { z } from 'zod';

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required!',
    }),
    genre: z.string({
      required_error: 'Genre is required!',
    }),
    author: z.string({
      required_error: 'Author Name is required!',
    }),
    user: z.string({
      required_error: 'User Name is required!',
    }),
    publicationDate: z.string({
      required_error: 'Publication Date is required!',
    }),
    reviews: z
      .object({
        name: z.string().optional(),
        email: z.string().optional(),
        review: z.string().optional(),
      })
      .optional(),
  }),
});

const updateBookZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    genre: z.string().optional(),
    author: z.string().optional(),
    publicationDate: z.string().optional(),
    user: z.string().optional(),
    reviews: z
      .object({
        name: z.string().optional(),
        email: z.string().optional(),
        review: z.string().optional(),
      })
      .optional(),
  }),
});

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema,
};
