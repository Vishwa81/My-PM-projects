import { z } from "zod";

export const createReviewSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Customer name is required")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(255, "Email is too long"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  title: z
    .string()
    .trim()
    .max(120, "Title cannot exceed 120 characters")
    .optional()
    .or(z.literal("")),
  comment: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review cannot exceed 1,000 characters"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
