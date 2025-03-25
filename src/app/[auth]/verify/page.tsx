"use client"

import { useState, useRef } from "react"
import { AuthLayout } from "@/components/ui/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function VerifyPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join("")
    console.log({ verificationCode })
  }

  return (
    <AuthLayout>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-white">Multi-factor Authentication</h2>
        <p className="text-gray-400">Enter the 6 digit code from your mail</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm text-white block mb-4">Authentication Code</label>
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="w-12 h-12 text-center bg-[#1C1C1C] border-0 text-white text-lg"
              />
            ))}
          </div>
        </div>
        <div className="text-center text-sm">
          <span className="text-gray-400">Did not receive Mail? </span>
          <button type="button" className="text-white hover:underline">
            Resend Mail
          </button>
        </div>
        <Button type="submit" className="w-full bg-white text-black hover:bg-gray-100">
          Verify
        </Button>
      </form>
    </AuthLayout>
  )
}

