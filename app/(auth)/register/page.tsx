"use client";
import { toast } from "@/components/ui/use-toast";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowRight, UserPlus, ShieldCheck, Mail, Lock } from "lucide-react";
import { useSignUpUserMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();
  const [signUpUser, { isLoading }] = useSignUpUserMutation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Invalid form data";
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: firstError,
      });
      return;
    }

    try {
      const res = await signUpUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(
        setUser({
          user: res?.data?.user,
          accessToken: res?.data?.accessToken,
        }),
      );

    
      setTimeout(() => router.push("/dashboard/membership"), 2000);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: err?.data?.message || "Something went wrong",
      });
    }
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <Card className="w-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl border-none overflow-hidden flex flex-col md:flex-row">
  

        {/* Right Side - Form */}
        <div className="flex-1 p-8 md:p-12 bg-white">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 text-sm font-medium">Step into a world of kindness.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    name="name"
                    value={formData.name}
                    placeholder="John Doe"
                    onChange={handleChange}
                    className="h-12 pl-10 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="john@example.com"
                    onChange={handleChange}
                    className="h-12 pl-10 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 pl-10 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Confirm</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-12 pl-10 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-base font-black bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
            >
              {isLoading ? "Creating Account..." : "Join Foundation"}
            </Button>

            <p className="text-center text-sm font-bold text-gray-400 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
}
