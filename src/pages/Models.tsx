import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, Brain, Sparkles } from "lucide-react";

const models = [
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Most capable model for complex reasoning and creative tasks",
    icon: Brain,
    badge: "Premium",
    features: ["Advanced reasoning", "Code generation", "Long context"],
  },
  {
    id: "gpt-3.5",
    name: "GPT-3.5",
    description: "Fast and efficient for most conversational tasks",
    icon: Zap,
    badge: "Fast",
    features: ["Quick responses", "General knowledge", "Cost-effective"],
  },
  {
    id: "claude",
    name: "Claude",
    description: "Excellent for analysis, writing, and detailed explanations",
    icon: Bot,
    badge: "Analytical",
    features: ["Deep analysis", "Creative writing", "Safety-focused"],
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google's multimodal AI for diverse tasks",
    icon: Sparkles,
    badge: "Multimodal",
    features: ["Image understanding", "Multilingual", "Real-time info"],
  },
];

export default function Models() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar isAuthenticated />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">AI Models</h1>
            <p className="text-lg text-muted-foreground">
              Choose from our collection of powerful AI models, each with unique strengths
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {models.map((model) => {
              const Icon = model.icon;
              return (
                <Card key={model.id} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="secondary">{model.badge}</Badge>
                    </div>
                    <CardTitle className="text-2xl mt-4">{model.name}</CardTitle>
                    <CardDescription className="text-base">
                      {model.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key Features:</p>
                      <ul className="space-y-1">
                        {model.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
