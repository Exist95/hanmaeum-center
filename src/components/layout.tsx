import Link from "next/link";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Image src={'/logo.png'} alt='logo' width={40} height={20} />
              <div className="flex">
                <Link
                  href="/"
                  className="flex items-center text-xl font-bold text-foreground"
                >
                  한마음재가복지센터
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <ModeToggle />
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      <footer className="bg-muted border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">
            © 2021 한마음재가복지센터. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
