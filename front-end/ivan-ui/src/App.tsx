import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import Navbar from "./components/layout/Navbar";
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
          <EventProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Navbar />
              <AppRoutes />
              <ChatBotFloatingButton />
              <Toaster />
            </div>
          </EventProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
