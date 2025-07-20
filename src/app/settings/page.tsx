"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import { DataManagementSettings } from "@/components/data-management-settings";
import { 
  Settings, 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  LogOut, 
  Coins,
  Crown,
  Zap,
  Palette,
  Database,
  Info,
  Save,
  CheckCircle
} from "lucide-react";

interface UserPreferences {
  allowPersistentStorage: boolean;
  defaultStorageMode: string;
  preferences: {
    theme: string;
    defaultTemplate: string;
    autoSaveEnabled: boolean;
    dataRetentionDays: number;
    analyticsOptOut: boolean;
    marketingOptOut: boolean;
    emailNotifications: boolean;
    exportNotifications: boolean;
    creditAlerts: boolean;
  };
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    marketing: false,
  });

  useEffect(() => {
    if (session) {
      fetchPreferences();
    }
  }, [session]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const prefs = await response.json();
        setUserPreferences(prefs);
        // Sync notification state with user preferences
        setNotifications({
          email: prefs.preferences.emailNotifications,
          browser: prefs.preferences.exportNotifications,
          marketing: !prefs.preferences.marketingOptOut,
        });
      }
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = (key: string, value: any) => {
    if (!userPreferences) return;
    
    if (key === 'allowPersistentStorage') {
      setUserPreferences({
        ...userPreferences,
        allowPersistentStorage: value,
        defaultStorageMode: value ? 'PERSISTENT' : 'MEMORY_ONLY'
      });
    } else if (key.startsWith('preferences.')) {
      const prefKey = key.replace('preferences.', '');
      setUserPreferences({
        ...userPreferences,
        preferences: {
          ...userPreferences.preferences,
          [prefKey]: value
        }
      });
      
      // Update local notifications state for UI consistency
      if (prefKey === 'emailNotifications') {
        setNotifications(prev => ({ ...prev, email: value }));
      } else if (prefKey === 'exportNotifications') {
        setNotifications(prev => ({ ...prev, browser: value }));
      } else if (prefKey === 'marketingOptOut') {
        setNotifications(prev => ({ ...prev, marketing: !value }));
      }
    }
  };

  const savePreferences = async () => {
    if (!userPreferences) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPreferences),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
    
    // Update user preferences based on notification changes
    if (type === 'email') {
      updatePreference('preferences.emailNotifications', value);
    } else if (type === 'browser') {
      updatePreference('preferences.exportNotifications', value);
    } else if (type === 'marketing') {
      updatePreference('preferences.marketingOptOut', !value);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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

        {/* Privacy & Storage Settings */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Storage Settings
            </CardTitle>
            <CardDescription>
              Control how your data is stored and managed by VentureForge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Save Status Alert */}
            {saved && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Settings Saved</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your preferences have been updated successfully.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Persistent Storage</Label>
                  <p className="text-sm text-gray-600">
                    Allow your project data to be saved permanently in our secure database
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {userPreferences && (
                      <Badge variant={userPreferences.allowPersistentStorage ? "default" : "secondary"}>
                        {userPreferences.allowPersistentStorage ? (
                          <>
                            <Database className="h-3 w-3 mr-1" />
                            Persistent Storage Enabled
                          </>
                        ) : (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Memory-Only Mode
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </div>
                {userPreferences && (
                  <Switch
                    checked={userPreferences.allowPersistentStorage}
                    onCheckedChange={(checked) => updatePreference('allowPersistentStorage', checked)}
                  />
                )}
              </div>

              {userPreferences && !userPreferences.allowPersistentStorage && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Privacy-First Mode Active</AlertTitle>
                  <AlertDescription>
                    Your projects will be stored in memory only and automatically deleted after 24 hours. 
                    Remember to export your projects regularly to avoid data loss.
                  </AlertDescription>
                </Alert>
              )}

              {userPreferences && userPreferences.allowPersistentStorage && (
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertTitle>Persistent Storage Enabled</AlertTitle>
                  <AlertDescription>
                    Your projects will be saved securely in our database and remain accessible until you delete them.
                    You can change back to memory-only mode at any time.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Analytics Opt-Out</Label>
                    <p className="text-sm text-gray-600">
                      Disable anonymous usage analytics
                    </p>
                  </div>
                  {userPreferences && (
                    <Switch
                      checked={userPreferences.preferences.analyticsOptOut}
                      onCheckedChange={(checked) => updatePreference('preferences.analyticsOptOut', checked)}
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Auto-Save Projects</Label>
                    <p className="text-sm text-gray-600">
                      Automatically save your progress as you work
                    </p>
                  </div>
                  {userPreferences && (
                    <Switch
                      checked={userPreferences.preferences.autoSaveEnabled}
                      onCheckedChange={(checked) => updatePreference('preferences.autoSaveEnabled', checked)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={savePreferences} 
                disabled={saving || !userPreferences}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Settings className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
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
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Export Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when project exports are ready
                </p>
              </div>
              <Switch
                checked={notifications.browser}
                onCheckedChange={(checked) => handleNotificationChange('browser', checked)}
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
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <ThemeToggle />
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

      {/* Data Management Section */}
      <div className="space-y-6">
        <DataManagementSettings />
      </div>
    </div>
  );
}