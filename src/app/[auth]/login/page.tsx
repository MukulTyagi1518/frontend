"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call the existing email-sign-in API
      const emailSignInResponse = await fetch("/api/auth/email-sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const emailSignInData = await emailSignInResponse.json();
      console.log("in next js apis", emailSignInData);
      console.log("ChallengeName",emailSignInData.response.ChallengeName);

      if (emailSignInData.response.ChallengeName === "MFA_SETUP") {
        console.log("MFA setup required!");
        Cookies.set("mfaSession", emailSignInData.response.Session, { expires: 1 });
        Cookies.set("userId", emailSignInData.response.ChallengeParameters.USER_ID_FOR_SRP, { expires: 1 });
        router.push("/auth/mfa-setup"); // Redirect to MFA setup page
        return;
    }


      // if (emailSignInData.response?.AuthenticationResult) {
      //   console.log("in next js apis (inside)", emailSignInData);
      //   const { IdToken, RefreshToken } =
      //     emailSignInData.response.AuthenticationResult;
      //   const requestId = emailSignInData.response.$metadata.requestId;

      //   Cookies.set("id_token", IdToken, { expires: 1 });
      //   Cookies.set("refresh_token", RefreshToken, {
      //     expires: 7,
          
      //   });
      //   Cookies.set("username", requestId, { expires: 1 });
      //   console.log(IdToken, RefreshToken, requestId);
      // }

      // First API call - Login
      
      // const loginResponse = await fetch(
      //   "http://localhost:4000/api/swasthi/admin/login",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ email, password }),
      //   }
      // );

      // const loginData = await loginResponse.json();
      // console.log("loginData",loginData);
      // if (!loginData.success) {
      //   setError(loginData.message || "Login failed");
      //   return;
      // }

      // // Store tempToken and userId in cookies
      // Cookies.set("tempToken", loginData.tempToken, {
      //   expires: 1,
       
      // });
      // Cookies.set("userId", loginData.userData._id, {
      //   expires: 1,
        
      // });
     
      // // Second API call - Check MFA setup, 
      // console.log("loginData",loginData);
      // console.log("loginData.userData._id",loginData.userData._id);

      // const mfaSetupResponse = await fetch(
      //   "http://localhost:4000/api/swasthi/admin/setup-mfa",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
        
      //     body: JSON.stringify({ userId: loginData.userData._id }),
      //   }
      
      // );

      // const mfaSetupData = await mfaSetupResponse.json();

      // Redirect based on MFA setup status
      // if (mfaSetupData.success) {
      //   // Store QR code for MFA setup
      //   localStorage.setItem("mfaQrCode", mfaSetupData.qrCode);
      //   router.push("/auth/mfa-setup");
      // } else {
      //   router.push("/auth/mfa-verify");
      // }
    } catch (err) {
      console.error("Error during authentication:", err);
      setError("An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Hi !</h2>
        <h3 className="text-2xl font-semibold text-white">
          Welcome to
          <br />
          Swasthi Admin Panel
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-white">
            Email ID<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1C1C1C] border-0 pl-10 text-white"
              required
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white">
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
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
          disabled={isLoading}
        >
          {isLoading ? "LOADING..." : "LOG IN"}
        </Button>
      </form>
    </AuthLayout>
  );
}