"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  LogOut, 
  Coins,
  Crown,
  Zap
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    marketing: false,
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={session?.user?.name || ""}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed as it&apos;s linked to your OAuth account
              </p>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Subscription & Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription & Billing
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-muted-foreground">Free Plan</p>
              </div>
              <Badge variant="outline">
                <Coins className="h-3 w-3 mr-1" />
                Free
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Forge Credits</span>
                <span className="font-medium">100 remaining</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
              <Button variant="outline" className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Buy More Credits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about your projects via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when AI processing is complete
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.browser}
                onChange={(e) => handleNotificationChange('browser', e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Marketing Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive news about new features and updates
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Connected Accounts</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">G</span>
                  </div>
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </div>
                <Badge variant="secondary">Connected</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Account Actions</Label>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}