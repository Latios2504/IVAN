import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ChatBotFloatingButton from "./components/chatbot/ChatBotFloatingButton";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Navbar />
            <AppRoutes />
            <ChatBotFloatingButton />
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
