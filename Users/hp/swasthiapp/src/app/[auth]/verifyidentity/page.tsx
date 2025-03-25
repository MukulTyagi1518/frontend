"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function VerifyIdentityPage() {
  const [verificationMethod, setVerificationMethod] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ verificationMethod });
  };

  return (
    <AuthLayout>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">
          Verify Your Identity
        </h2>
        <p className="text-gray-400">We need to confirm it is really you</p>
        <p className="text-gray-400">Select your preferred verification mode</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup
          value={verificationMethod}
          onValueChange={setVerificationMethod}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="msg"
              id="msg"
              className="border-white text-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <Label
              htmlFor="msg"
              className="text-white bg-[#1C1C1C] w-full py-3 px-4 rounded-md cursor-pointer"
            >
              Send OTP Via Msg
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="email"
              id="email"
              className="border-white text-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <Label
              htmlFor="email"
              className="text-white bg-[#1C1C1C] w-full py-3 px-4 rounded-md cursor-pointer"
            >
              Send OTP Via Email
            </Label>
          </div>
        </RadioGroup>
        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-gray-100"
          disabled={!verificationMethod}
        >
          Confirm
        </Button>
      </form>
    </AuthLayout>
  );
}
