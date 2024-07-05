import { z } from "zod";

export const evaluationSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  connection: z.enum(["club", "workshop", "zaylen", "mentorship", "project"], {
    message: "Select an option",
  }),
  details: z.string().optional(),
  rating: z
    .number()
    .min(1)
    .max(5, { message: "Rating must be between 1 and 5" }),
  feedback: z.string().min(1, { message: "Feedback is required" }),
});

export type EvaluationSchema = z.infer<typeof evaluationSchema>;
