"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Validation schema
const formSchema = z.object({
  active: z.boolean(),
  image: z.instanceof(File).optional(),
  healthTip: z.string().min(10, "Tip must be at least 10 characters"),
  createdAt: z.string(),
  shares: z.number().min(0),
});

type FormData = z.infer<typeof formSchema>;

export default function HealthTipForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
      shares: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Form Data Submitted:", data);
    // Handle file upload logic here
  };

  return (
    <Card className="max-w-lg mx-auto bg-[#121212] text-white p-6 rounded-lg shadow-lg border border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <Label className="text-gray-300">Status:</Label>
            <Switch {...register("active")} defaultChecked />
          </div>
          <Separator className="bg-gray-700" />

          <div className="py-2">
            <Label className="text-gray-300">Image:</Label>
            <div className="border border-gray-600 p-4 rounded-lg flex flex-col items-center justify-center text-gray-400 mt-2">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("image", file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
              ) : (
                <p className="text-sm">Click to upload or drag and drop</p>
              )}
            </div>
          </div>
          <Separator className="bg-gray-700" />

          <div className="py-2">
            <Label className="text-gray-300">Health Tip:</Label>
            <Textarea {...register("healthTip")} placeholder="Enter a health tip..." className="bg-gray-800 text-white mt-2" />
            {errors.healthTip && <p className="text-red-500 text-sm">{errors.healthTip.message}</p>}
          </div>
          <Separator className="bg-gray-700" />

          <div className="py-2">
            <Label className="text-gray-300">Created At:</Label>
            <Input type="date" {...register("createdAt")} disabled className="bg-gray-800 text-white mt-2" />
          </div>
          <Separator className="bg-gray-700" />

          <div className="py-2">
            <Label className="text-gray-300">No. of Shares:</Label>
            <Input type="number" {...register("shares", { valueAsNumber: true })} className="bg-gray-800 text-white mt-2" />
          </div>
          <Separator className="bg-gray-700" />

          <div className="flex justify-end mt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6">Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}