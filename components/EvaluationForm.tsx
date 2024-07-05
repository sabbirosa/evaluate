"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { evaluationSchema, EvaluationSchema } from "@/schemas/evaluationSchema";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingButton } from "./ui/loading-button";

type FormErrors = Partial<Record<keyof EvaluationSchema, string>>;

export default function EvaluationForm() {
  const [rating, setRating] = useState<number>(3);
  const [formData, setFormData] = useState<
    Omit<EvaluationSchema, "rating" | "connection"> & { connection?: string }
  >({
    name: undefined,
    email: undefined,
    connection: "",
    details: "",
    feedback: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, connection: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = evaluationSchema.safeParse({ ...formData, rating });
    if (!result.success) {
      const formattedErrors: FormErrors = {};
      for (const [key, errorArray] of Object.entries(
        result.error.flatten().fieldErrors
      )) {
        if (errorArray && errorArray.length > 0) {
          formattedErrors[key as keyof EvaluationSchema] = errorArray[0];
        }
      }
      setErrors(formattedErrors);
      return;
    }

    try {
      const response = await fetch("/api/submitFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      toast.success("Feedback submitted successfully!");
      setFormData({
        name: "",
        email: "",
        connection: undefined,
        details: "",
        feedback: "",
      });
      setRating(3);
      setErrors({});
    } catch (error) {
      toast.error("Failed to submit feedback!");
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-3xl mb-2 text-[#0000F5]/80">
          Evaluate Sabbir!
        </CardTitle>
        <CardDescription>
          Please provide your feedback on your experience of work with me. Your
          insights are valuable and help me to improve. Please include details
          about the specific project, club, or mentorship you were involved in,
          and how you came to know me.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-600">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-600">{errors.email}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="select-howDoYouKnowMe">How do you know me?</Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger id="select-howDoYouKnowMe">
                <SelectValue placeholder="Select connection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="club">
                  BRAC University Computer Club
                </SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="zaylen">Zaylen Digital</SelectItem>
                <SelectItem value="mentorship">Mentorship</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
            {errors.connection && (
              <p className="text-red-600">{errors.connection}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">
              Details about the connection (Optional)
            </Label>
            <Textarea
              id="details"
              placeholder="Provide any additional details about our connection"
              value={formData.details}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRating(value)}
                  className="focus:outline-none"
                >
                  <StarIcon
                    className={`h-6 w-6 ${
                      value <= rating ? "fill-[#0000F5]/80" : "fill-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && <p className="text-red-600">{errors.rating}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Provide your feedback on your experience with Sabbir"
              value={formData.feedback}
              onChange={handleChange}
            />
            {errors.feedback && (
              <p className="text-red-600">{errors.feedback}</p>
            )}
          </div>
          <CardFooter className="p-0">
            <LoadingButton
              type="submit"
              className="w-full bg-[#0000F5]/80 hover:bg-[#0000F5]/90 text-white"
            >
              Submit Feedback
            </LoadingButton>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
