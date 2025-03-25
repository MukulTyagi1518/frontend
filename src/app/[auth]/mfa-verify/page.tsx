// "use client";

// import { useState } from "react";
// import { AuthLayout } from "@/components/ui/auth-layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export default function MFAVerifyPage() {
//   const [code, setCode] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle MFA verification
//   };

//   return (
//     <AuthLayout>
//       <div className="space-y-6">
//         <div className="space-y-2">
//           <h2 className="text-2xl font-semibold text-white">
//             Keeping you secure
//           </h2>
//           <p className="text-gray-400">
//             Your account is protected with multi-factor authentication (MFA)
//           </p>
//           <p className="text-gray-400">
//             To finish signing in, enter the code from your MFA device below.
//           </p>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <label className="text-white">MFA Code</label>
//             <Input
//               type="text"
//               placeholder="Enter code"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               className="bg-[#1C1C1C] border-0 text-white placeholder:text-gray-500"
//             />
//           </div>
//           <div className="flex justify-center ">
//           <Button
//             type="submit"
//             className="w-[150px] h-[52px] bg-white text-black hover:bg-gray-100 rounded-lg text-[15px] font-medium "
//             disabled={!code}
//           >
//             SIGN IN
//           </Button>
//           </div>
//         </form>
//       </div>
//     </AuthLayout>
//   );
// }
"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function MFAVerifyPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userId = Cookies.get("userId");
      const tempToken = Cookies.get("tempToken");
      console.log(userId,tempToken,code);
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
            totpCode: code,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "MFA verification failed");
        return;
      }

      // Redirect to home page on success
      router.push("/mediaManagement-table");
    } catch (err) {
      console.error("Error during MFA verification:", err);
      setError("An error occurred during MFA verification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">
            Keeping you secure
          </h2>
          <p className="text-gray-400">
            Your account is protected with multi-factor authentication (MFA)
          </p>
          <p className="text-gray-400">
            To finish signing in, enter the code from your MFA device below.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-white">MFA Code</label>
            <Input
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-[#1C1C1C] border-0 text-white placeholder:text-gray-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-gray-100"
            disabled={!code || isLoading}
          >
            {isLoading ? "Verifying..." : "SIGN IN"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
