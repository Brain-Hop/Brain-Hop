import { useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { MODELS, loadSelectedModelId, DEFAULT_MODEL_ID } from "@/data/models";
import {
  User,
  Mail,
  Link as LinkIcon,
  Building2,
  Globe,
  MapPin,
  ShieldCheck,
  Upload,
  KeyRound,
  LogOut,
  Trash2,
} from "lucide-react";

// where we persist profile + prefs locally for quick restore
const PROFILE_LS_KEY = "profile_page_prefs_v1";

type Theme = "system" | "light" | "dark";

type ProfilePrefs = {
  defaultModelId: string;
  theme: Theme;
  language: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  saveHistory: boolean;
  twoFAEnabled: boolean;
};

type ProfileForm = {
  name: string;
  email: string;
  username: string;
  bio: string;
  role: string;
  company: string;
  website: string;
  location: string;
  avatarDataUrl?: string | null; // preview only
};

const defaultPrefs: ProfilePrefs = {
  defaultModelId: DEFAULT_MODEL_ID,
  theme: "system",
  language: "en",
  emailNotifications: true,
  desktopNotifications: false,
  saveHistory: true,
  twoFAEnabled: false,
};

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---------- hydrate ----------
  const cached = useMemo(() => {
    try {
      const raw = localStorage.getItem(PROFILE_LS_KEY);
      return raw ? (JSON.parse(raw) as { profile?: Partial<ProfileForm>; prefs?: Partial<ProfilePrefs> }) : {};
    } catch {
      return {};
    }
  }, []);

  const initialName = useMemo(
    () => user?.name || (user?.email ? user.email.split("@")[0] : ""),
    [user?.name, user?.email]
  );

  const [profile, setProfile] = useState<ProfileForm>({
    name: cached.profile?.name ?? initialName ?? "",
    email: cached.profile?.email ?? user?.email ?? "",
    username: cached.profile?.username ?? "",
    bio: cached.profile?.bio ?? "",
    role: cached.profile?.role ?? "",
    company: cached.profile?.company ?? "",
    website: cached.profile?.website ?? "",
    location: cached.profile?.location ?? "",
    avatarDataUrl: cached.profile?.avatarDataUrl ?? null,
  });

  const [prefs, setPrefs] = useState<ProfilePrefs>({
    defaultModelId:
      cached.prefs?.defaultModelId ?? loadSelectedModelId() ?? DEFAULT_MODEL_ID,
    theme: (cached.prefs?.theme as Theme) ?? "system",
    language: cached.prefs?.language ?? "en",
    emailNotifications: cached.prefs?.emailNotifications ?? true,
    desktopNotifications: cached.prefs?.desktopNotifications ?? false,
    saveHistory: cached.prefs?.saveHistory ?? true,
    twoFAEnabled: cached.prefs?.twoFAEnabled ?? false,
  });

  // security form (stubbed)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // keep localStorage in sync for fast restore
  useEffect(() => {
    localStorage.setItem(
      PROFILE_LS_KEY,
      JSON.stringify({ profile, prefs })
    );
  }, [profile, prefs]);

  // sync the "default model" to your models page selection too
  useEffect(() => {
    if (prefs.defaultModelId) {
      localStorage.setItem("selected_model_id", prefs.defaultModelId);
    }
  }, [prefs.defaultModelId]);

  // ---------- handlers ----------
  const handleSaveProfile = () => {
    // here you’d call your backend to persist profile fields
    toast({ title: "Profile updated", description: "Your details were saved." });
  };

  const handleSavePrefs = () => {
    // here you’d call your backend (or user settings API) if needed
    toast({ title: "Preferences saved", description: "Your preferences were updated." });
  };

  const handleChangePassword = () => {
    if (!newPassword || newPassword !== confirmNewPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    // call backend here
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    toast({ title: "Password changed", description: "Your password has been updated." });
  };

  const handleConnectGoogle = () => {
    // kick off OAuth; placeholder
    toast({ title: "Google", description: "Connecting Google account..." });
  };

  const handleDisconnectGoogle = () => {
    toast({ title: "Google", description: "Disconnected Google account." });
  };

  const handleAvatarPick = () => fileInputRef.current?.click();

  const onAvatarSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((p) => ({ ...p, avatarDataUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
      // if you want to upload to Supabase, do it here and store the URL instead
    } catch {
      toast({ title: "Avatar error", description: "Failed to load image.", variant: "destructive" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => logout();

  const handleDeleteAccount = () => {
    // you’d call a backend endpoint to delete the user permanently
    toast({
      title: "Account deletion",
      description: "In a real app your account would now be scheduled for deletion.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto">
                {profile.avatarDataUrl ? (
                  <AvatarImage src={profile.avatarDataUrl} alt={profile.name} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {(profile.name || "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={handleAvatarPick}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change avatar
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarSelected}
              />
            </div>

            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account info, preferences, and security
            </p>
          </div>

          {/* Account info */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
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
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="yourhandle"
                  value={profile.username}
                  onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="role"
                    className="pl-9"
                    placeholder="e.g., Product Manager"
                    value={profile.role}
                    onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    className="pl-9"
                    placeholder="Company Inc."
                    value={profile.company}
                    onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    className="pl-9"
                    placeholder="https://example.com"
                    value={profile.website}
                    onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    className="pl-9"
                    placeholder="City, Country"
                    value={profile.location}
                    onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell people a bit about you..."
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-2">
                <Button onClick={handleSaveProfile} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleLogout} className="flex-1">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Defaults and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Default Model</Label>
                  <Select
                    value={prefs.defaultModelId}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, defaultModelId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a model" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {MODELS.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={prefs.theme}
                    onValueChange={(v: Theme) => setPrefs((p) => ({ ...p, theme: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={prefs.language}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, language: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="hi">हिन्दी</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive summaries and alerts via email
                    </p>
                  </div>
                  <Switch
                    checked={prefs.emailNotifications}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, emailNotifications: v }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Desktop notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Enable push notifications
                    </p>
                  </div>
                  <Switch
                    checked={prefs.desktopNotifications}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, desktopNotifications: v }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Save conversation history</p>
                    <p className="text-sm text-muted-foreground">
                      Store chats for better context
                    </p>
                  </div>
                  <Switch
                    checked={prefs.saveHistory}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, saveHistory: v }))}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={handleSavePrefs}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Password & 2FA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirm new password</Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleChangePassword}>
                <KeyRound className="h-4 w-4 mr-2" />
                Change password
              </Button>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-factor authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={prefs.twoFAEnabled}
                  onCheckedChange={(v) => {
                    setPrefs((p) => ({ ...p, twoFAEnabled: v }));
                    toast({
                      title: v ? "2FA enabled" : "2FA disabled",
                      description:
                        v
                          ? "In a real app you’d be guided through a setup flow."
                          : "Two-factor has been turned off.",
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage linked providers</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleConnectGoogle}>
                <Globe className="h-4 w-4 mr-2" />
                Connect Google
              </Button>
              <Button variant="secondary" onClick={handleDisconnectGoogle}>
                Disconnect Google
              </Button>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="shadow-soft border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Think twice before you do these</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete account
              </Button>
            </CardContent>
          </Card>

          {/* Usage (example – wire to real stats later) */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Your recent activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Conversations</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Messages Sent</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Favorite Model</span>
                <span className="font-semibold">
                  {MODELS.find((m) => m.id === prefs.defaultModelId)?.name ?? "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
