import Image from "next/image"
// import MainLogo from "@/images/MainLogo.svg";
interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#1C1C1C] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2C2C2C] rounded-lg p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative w-16 h-16">
            <Image
              src="/logo.svg"
              alt="swasthi Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white">Swasthi</h1>
        </div>
        {children}
      </div>
    </div>
  )
}