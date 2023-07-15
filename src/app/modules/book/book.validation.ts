import { z } from 'zod';

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required!',
    }),
    genre: z.number({
      required_error: 'Genre is required!',
    }),
    author: z.number({
      required_error: 'Author is required!',
    }),
    publicationDate: z.date({
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
    genre: z.number().optional(),
    author: z.number().optional(),
    publicationDate: z.date().optional(),
    reviews: z.object({
      name: z.string().optional(),
      email: z.string().optional(),
      review: z.string().optional(),
    }),
  }),
});

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema,
};
