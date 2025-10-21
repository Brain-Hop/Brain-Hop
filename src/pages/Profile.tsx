import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Mail } from "lucide-react";

export default function Profile() {
  const [email, setEmail] = useState("user@example.com");
  const [name, setName] = useState("User");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    // TODO: Implement actual logout logic
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar isAuthenticated />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your personal details and email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button onClick={handleLogout} variant="outline" className="flex-1">
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>
                Track your AI chat usage and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Total Conversations</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Messages Sent</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Favorite Model</span>
                <span className="font-semibold">GPT-4</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
