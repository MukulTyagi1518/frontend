"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function MFASetupPage() {
  const [mfaCode, setMfaCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedQrCode = localStorage.getItem("mfaQrCode");
    if (storedQrCode) {
      setQrCode(storedQrCode);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userId = Cookies.get("userId");
      const tempToken = Cookies.get("tempToken");
console.log(userId,tempToken,mfaCode);
      if (!userId || !tempToken) {
        throw new Error("Authentication credentials missing");
      }

      const response = await fetch(
        "http://localhost:4000/api/swasthi/admin/verify-mfa",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            tempToken,
            totpCode: mfaCode,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "MFA verification failed");
        return;
      }

      // Clear temporary storage
      localStorage.removeItem("mfaQrCode");

      // Redirect to home page
      router.push("/mediaManagement-table");
    } catch (err) {
      console.error("Error during MFA setup:", err);
      setError("An error occurred during MFA setup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-20 items-center justify-center rounded-full border border-white text-white leading-none">
              1
            </div>
            <div className="space-y-2 ">
              <p className="text-white  ">
                Install a compatible application such as Google Authenticator,
                Duo Mobile, or Authentication app on your mobile device or
                computer.
              </p>
              <Link href="#" className="text-white hover:underline">
                See a list of compatible applictions
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-16 items-center justify-center rounded-full border border-white text-white">
              2
            </div>
            <div className="space-y-2">
              <p className="text-white">
                Open your authenticator app, choose Show QR Code on this page,
                then use the app to scan the code.
              </p>
            
              {/* <Link href="#" className="text-white hover:underline">
                Show secret key
              </Link> */}
            </div>
            
          </div>

          {/* <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white text-white">
              3
            </div>
            <div className="space-y-2">
              <p className="text-white">Type MFA code below</p>
              <p className="text-gray-400">
                Enter a code from your virtual app below
              </p>
              <Input
                type="text"
                placeholder="MFA Code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="bg-[#1C1C1C] border-0 text-white placeholder:text-gray-500"
              />
            </div>
          </div> */}
        </div>
        <div className="relative m-auto aspect-square w-40 bg-white p-2">
                <Image
                  src={qrCode || "/placeholder.svg"}
                  alt="QR Code"
                  width={150}
                  height={150}
                  className="h-full w-full"
                />
              </div>

        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 text-white border-white hover:bg-[#1C1C1C] hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => router.push("/auth/mfa-verify")}
            className="flex-1 bg-white text-black hover:bg-gray-100"
          >
            NEXT
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
