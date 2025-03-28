"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import QRCode from "qrcode";

export default function MFASetupPage() {
  const [qrCode, setQrCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const mfaToken = Cookies.get("mfaSession");
  console.log("mfaToken", mfaToken);

  useEffect(() => {
    // Check localStorage first
    const storedQrCode = localStorage.getItem("mfaQrCode");
    if (storedQrCode) {
      setQrCode(storedQrCode);
    } else {
      if (mfaToken) {
        console.log("calling fetchQrCode");
        fetchQrCode();
      }
    }
  }, [mfaToken]);

  useEffect(() => {
    console.log("qrCode", qrCode);
  }, [qrCode])

  const fetchQrCode = async () => {
    try {

      if (!mfaToken) {
        throw new Error("Missing authentication token");
      }

      const response = await fetch("/api/auth/mfa-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: mfaToken
        }),
      });

      const data = await response.json();

      console.log("fetchQrCode", data);

      if (!data.success || !data.secretCode) {
        throw new Error("Failed to retrieve MFA secret");
      }

      if(data.secretCode){
        localStorage.setItem("mfaSecret", data.secretCode);
        const otpAuthUrl = `otpauth://totp/Fitnearn?secret=${data.secretCode}&issuer=Fitnearn`;

        // Generate QR Code as a Data URL
        QRCode.toDataURL(otpAuthUrl)
          .then((url:string) => {
            console.log("Generated QR Code:", url);
            localStorage.setItem("mfaQrCode", url);
            setQrCode(url);
          })
          .catch((err:any) => console.error("Error generating QR Code:", err));
      }
    } catch (err) {
      console.error("Error fetching QR code:", err);
      setError("Failed to retrieve MFA QR code");
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
            <div className="space-y-2">
              <p className="text-white">
                Install a compatible authentication app like Google Authenticator or Duo Mobile.
              </p>
              <Link href="#" className="text-white hover:underline">
                See compatible applications
              </Link>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-16 items-center justify-center rounded-full border border-white text-white">
              2
            </div>
            <div className="space-y-2">
              <p className="text-white">Scan the QR code below with your authenticator app.</p>
            </div>
          </div>
        </div>

        <div className="relative m-auto aspect-square w-40 bg-white p-2">
          {qrCode ? (
            <Image src={qrCode} alt="QR Code" width={150} height={150} className="h-full w-full" />
          ) : (
            <p className="text-gray-400">Generating QR Code...</p>
          )}
        </div>

        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 text-white border-white hover:bg-[#1C1C1C] hover:text-white"
            // onClick={() => router.push("/some-cancel-route")}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1 bg-white text-black hover:bg-gray-100"
            onClick={() => router.push("/auth/mfa-verify")}
          >
            Continue
          </Button>
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </AuthLayout>
  );
}