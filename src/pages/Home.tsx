import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import { Bot, MessageSquare, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Your AI Assistant
            <span className="block bg-gradient-hero bg-clip-text text-transparent mt-2">
              Powered by Multiple Models
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience seamless conversations with cutting-edge AI models. Switch between models, 
            merge conversations, and get intelligent responses tailored to your needs.
          </p>
          
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Conversations</h3>
            <p className="text-muted-foreground">
              Engage in intelligent conversations with context-aware AI that remembers 
              your chat history and preferences.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Multiple Models</h3>
            <p className="text-muted-foreground">
              Switch between different AI models mid-conversation to get the best 
              response for each task.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl shadow-soft border border-border">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your conversations are encrypted and stored securely. We prioritize 
              your privacy and data protection.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto bg-card p-12 rounded-3xl shadow-medium border border-border text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already experiencing the power of AI-assisted conversations.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <Link to="/signup">Create Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 AI Chat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
