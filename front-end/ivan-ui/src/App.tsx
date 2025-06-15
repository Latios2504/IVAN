import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/layout";
import { ChatBotFloatingButton } from "./components/chatbot";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <AppRoutes />
          <ChatBotFloatingButton />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
