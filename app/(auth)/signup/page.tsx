"use client";
import { toast } from "@/components/ui/use-toast";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useSignUpUserMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(11, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const router = useRouter();
  const [signUpUser, { isLoading }] = useSignUpUserMutation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    avatar: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const validation = signupSchema.safeParse(formData);

  if (!validation.success) {
    const firstError =
      validation.error.errors[0]?.message || "Invalid form data";

    toast({
      variant: "destructive",
      title: "Validation Error",
      description: firstError,
    });

    return;
  }

  try {
    const res = await signUpUser({
      avatar: formData.avatar,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
    }).unwrap();

    dispatch(
      setUser({
        user: res?.data?.user,
        accessToken: res?.data?.accessToken,
      })
    );

    toast({
      title: "Application Successful 🎉",
      description: "Your membership account has been created.",
    });

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  } catch (err: any) {
    toast({
      variant: "destructive",
      title: "Signup Failed",
      description: err?.data?.message || "Something went wrong",
    });
  }
};


  if (success) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto">
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
        <p className="text-foreground/60 mb-4">
          Your membership account has been created.
        </p>
        <p className="text-sm text-foreground/50">
          Redirecting to your dashboard...
        </p>
      </Card>
    );
  }

  return (
    // কার্ডের উইডথ এবং প্যাডিং আপডেট করা হয়েছে
    <Card className="p-6 md:p-10 max-w-4xl mx-auto shadow-xl border-t-4 border-t-emerald-600 my-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-emerald-700">
          Membership Application
        </h1>
        <p className="text-muted-foreground italic text-sm">
          Be a part of Alhamdulillah Foundation's mission.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="border-b pb-4">
          <div className="flex flex-col items-center justify-center gap-6">
            <CloudinaryUpload
              label="Upload your image"
              value={formData.avatar}
              onUploadSuccess={(url) =>
                setFormData({ ...formData, avatar: url })
              }
              onRemove={() => setFormData({ ...formData, avatar: "" })}
            />
          </div>
        </section>

        {/* Contact */}
        <section className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className=" space-y-2">
            <Label className="font-semibold ">Full Name</Label>
            <Input
              name="name"
              value={formData.name}
              placeholder="Enter your full name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Email Address </Label>
            <Input
              type="email"
              value={formData.email}
              name="email"
              placeholder="example@mail.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Phone Number </Label>
            <Input
              name="phone"
              value={formData.phone}
              placeholder="+880 1XXX-XXXXXX"
              onChange={handleChange}
              required
            />
          </div>
        </section>

        {/* Address */}
        <section className="space-y-2">
          <Label className="font-semibold">Present Address </Label>
          <Input
            name="address"
            value={formData.address}
            placeholder="Flat, Road, Area, City"
            onChange={handleChange}
            required
          />
        </section>

        {/* Password */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border">
          <div className="space-y-2">
            <Label className="font-semibold">Password </Label>
            <Input
              type="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Confirm Password </Label>
            <Input
              type="password"
              value={formData.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              required
            />
          </div>
        </section>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 transition-all"
        >
          {isLoading ? "Processing..." : "Complete Application"}
        </Button>
      </form>
    </Card>
  );
}
