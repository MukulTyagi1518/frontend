

import Link from "next/link";
import Image from "next/image";

// Define the header props
interface HeaderProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ isOpen, setIsOpen }: HeaderProps) => {
  return (
    <header className="relative w-full h-[64px] flex items-center bg-black-900 border-b-2 border-neutral-600 text-white shadow-lg">
      {/* Logo Image */}
      <div className="absolute left-4 flex items-center justify-center w-10 h-10">
        <Image
          className="object-cover"
          src="/logo.svg"
          alt="Logo"
          width={40} // Set width and height as per your requirement
          height={40}
        />
      </div>

      {/* Right Section: Notifications & Profile */}
      <div className="absolute right-5 flex items-center gap-2">
        <div className="pt-3 pr-6 gap-6 rounded-full " aria-label="Notifications">
          <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18.8217 15.4482V12.922C18.8227 11.2145 18.1984 9.55668 17.0498 8.21652C15.9011 6.87636 14.2952 5.93223 12.4918 5.53679C12.5056 5.48781 12.5162 5.43814 12.5238 5.38802V2.07018C12.5238 1.69795 12.3633 1.34096 12.0775 1.07776C11.7917 0.814554 11.4041 0.666687 11 0.666687C10.5959 0.666687 10.2083 0.814554 9.92251 1.07776C9.63674 1.34096 9.4762 1.69795 9.4762 2.07018V5.38802C9.48378 5.43814 9.49446 5.48781 9.5082 5.53679C7.70479 5.93223 6.09891 6.87636 4.95024 8.21652C3.80158 9.55668 3.17728 11.2145 3.1783 12.922V15.4482C3.1783 18.797 0.333344 19.6334 0.333344 21.3078C0.333344 22.1401 0.333344 22.9822 1.15315 22.9822H20.8469C21.6667 22.9822 21.6667 22.1401 21.6667 21.3078C21.6667 19.6334 18.8217 18.797 18.8217 15.4482Z"
              fill="#FAFAFA"
            />
            <path
              d="M6.15887 24.3857C6.5631 25.2601 7.23755 26.0057 8.09832 26.5298C8.95908 27.0539 9.96816 27.3334 11 27.3334C12.0319 27.3334 13.0409 27.0539 13.9017 26.5298C14.7625 26.0057 15.4369 25.2601 15.8412 24.3857H6.15887Z"
              fill="#FAFAFA"
            />
          </svg>
        </div>

        <Link href="/profile" className="flex items-center pr-6 pt-3 gap-4">
          <Image
            width={30}
            height={30}
            className="h-8 w-8 rounded-full object-cover"
            loading="eager"
            alt="Profile"
            src="/profile.jpeg"
          />
          <span className="font-medium">Mukul Tyagi</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;