import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="fixed top-0 left-0 right-0 z-50 w-ful">
        <MainNav />
      </div>
      <div className="flex-grow flex items-center justify-center pt-16 w-full">
        <h1>Welcome to the Home Page</h1>
          
      </div>
    </main>
  );
}
