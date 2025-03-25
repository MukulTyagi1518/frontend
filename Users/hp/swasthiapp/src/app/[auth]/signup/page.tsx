"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (response.ok) {
      alert("Account created successfully!");
    } else {
      alert(data.error || "An error occurred");
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Hi !</h2>
        <h3 className="text-2xl font-semibold text-white">
          SIGN UP to
          <br />
          FitnEarnPal Admin Panel
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-white">
            Email ID<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type="email"
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1C1C1C] border-0 pl-10 text-white"
              required
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="passoword" className="text-sm text-white">
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1C1C1C] border-0 pl-10 pr-10 text-white"
              required
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label htmlFor="remember" className="text-sm text-white">
              Remember Me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-white hover:underline"
          >
            Forget password ?
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-gray-100"
        >
          Create Account
        </Button>
      </form>
    </AuthLayout>
  );
}
