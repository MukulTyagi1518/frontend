"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User2, Lock, X, Eye, EyeOff } from "lucide-react" // Ensure correct imports
import Image from "next/image" // Import Image for logo

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [email, setEmail] = useState("Nikita.Jain@gmail.com")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[460px] space-y-6 p-8 rounded-xl bg-neutral-900">
        <div className="flex flex-col items-center space-y-3">
          {/* Logo without Red Background */}
          <Image src="/logo.svg" alt="FitnEarnPal Logo" width={60} height={60} />
          <h1 className="text-2xl font-semibold text-white">Swasthi</h1>
        </div>

        <div className="space-y-1">
          <h2 className="text-[28px] font-medium text-white">Hi !</h2>
          <div className="text-[22px] text-white">
            Welcome to
            <p className="mt-0.5">Swasthi Admin Panel</p>
          </div>
        </div>

        <form className="space-y-5">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[15px] text-white flex items-center">
                Email ID<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-11 pr-10 bg-[#232323] border-[#3a3a3a] text-white rounded-lg focus:ring-0 focus:border-[#3a3a3a]"
                />
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User2 className="h-5 w-5 text-gray-400" />
                </div>
                {/* Clear Email Button */}
                {email && (
                  <button
                    type="button"
                    onClick={() => setEmail("")}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[15px] text-white flex items-center">
                Password<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pl-11 pr-10 bg-[#232323] border-[#3a3a3a] text-white rounded-lg focus:ring-0 focus:border-[#3a3a3a]"
                />
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                {/* Toggle Password Visibility */}
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {passwordVisible ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                className="w-[18px] h-[18px] border-[#3a3a3a] data-[state=checked]:bg-white data-[state=checked]:text-black rounded-[4px]"
              />
              <label htmlFor="remember" className="text-[15px] text-white">
                Remember Me
              </label>
            </div>
            <a href="#" className="text-[15px] text-white hover:text-gray-300">
              Forget password?
            </a>
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
          <Button className="w-[150px]  h-[52px] mt-2 bg-white text-black hover:bg-gray-100 rounded-lg text-[15px] font-medium">
            Sign IN
          </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
