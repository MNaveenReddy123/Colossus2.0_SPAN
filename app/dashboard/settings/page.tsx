"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Shield, Wallet, LogOut } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: true,
    newBadges: true,
    friendActivity: false,
    marketingEmails: false,
  })

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showLeaderboard: true,
    showActivity: true,
    showBadges: true,
  })

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Profile Picture</div>
                    <div className="text-xs text-muted-foreground">
                      Your profile picture will be shown across the platform
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Change
                      </Button>
                      <Button size="sm" variant="outline">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Alex Johnson" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="alexj213" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="alex.johnson@example.com" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    defaultValue="Learning about finance to secure my future. Currently focused on investment basics."
                  />
                  <div className="text-xs text-muted-foreground">Your bio will be shown on your public profile</div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="level">Financial Literacy Level</Label>
                  <Select defaultValue="intermediate">
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground">
                    This helps us personalize content for your learning journey
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications" className="flex-1">
                        Email Notifications
                        <span className="block text-xs text-muted-foreground">Receive notifications via email</span>
                      </Label>
                      <Switch
                        id="email-notifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="weekly-report" className="flex-1">
                        Weekly Progress Report
                        <span className="block text-xs text-muted-foreground">
                          Receive a weekly summary of your progress
                        </span>
                      </Label>
                      <Switch
                        id="weekly-report"
                        checked={notifications.weeklyReport}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing-emails" className="flex-1">
                        Marketing Emails
                        <span className="block text-xs text-muted-foreground">
                          Receive promotional emails and offers
                        </span>
                      </Label>
                      <Switch
                        id="marketing-emails"
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Push Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications" className="flex-1">
                        Push Notifications
                        <span className="block text-xs text-muted-foreground">
                          Receive notifications on your device
                        </span>
                      </Label>
                      <Switch
                        id="push-notifications"
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="new-badges" className="flex-1">
                        New Badges
                        <span className="block text-xs text-muted-foreground">
                          Get notified when you earn a new badge
                        </span>
                      </Label>
                      <Switch
                        id="new-badges"
                        checked={notifications.newBadges}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, newBadges: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="friend-activity" className="flex-1">
                        Friend Activity
                        <span className="block text-xs text-muted-foreground">
                          Get notified about your friends' activities
                        </span>
                      </Label>
                      <Switch
                        id="friend-activity"
                        checked={notifications.friendActivity}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, friendActivity: checked })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Notification Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Profile Visibility</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="public-profile" className="flex-1">
                        Public Profile
                        <span className="block text-xs text-muted-foreground">Allow others to view your profile</span>
                      </Label>
                      <Switch
                        id="public-profile"
                        checked={privacy.publicProfile}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, publicProfile: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-leaderboard" className="flex-1">
                        Show on Leaderboard
                        <span className="block text-xs text-muted-foreground">
                          Allow your name to appear on leaderboards
                        </span>
                      </Label>
                      <Switch
                        id="show-leaderboard"
                        checked={privacy.showLeaderboard}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showLeaderboard: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Activity Sharing</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-activity" className="flex-1">
                        Share Activity
                        <span className="block text-xs text-muted-foreground">
                          Allow others to see your recent activities
                        </span>
                      </Label>
                      <Switch
                        id="show-activity"
                        checked={privacy.showActivity}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showActivity: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-badges" className="flex-1">
                        Share Badges
                        <span className="block text-xs text-muted-foreground">
                          Allow others to see your earned badges
                        </span>
                      </Label>
                      <Switch
                        id="show-badges"
                        checked={privacy.showBadges}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showBadges: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Data Usage</h3>
                  <p className="text-xs text-muted-foreground">
                    We use your data to improve your experience and provide personalized content. You can control how we
                    use your data below.
                  </p>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Your data is protected and never sold to third parties</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Privacy Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Change Password</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="mt-2">Update Password</Button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Connected Accounts</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-[#4285F4] p-1">
                          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Google</div>
                          <div className="text-xs text-muted-foreground">Connected</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Wallet Settings</h3>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Virtual Wallet</div>
                          <div className="text-xs text-muted-foreground">Current Balance: 500 Coins</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
                  <div className="rounded-md border border-destructive/20 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm font-medium">Delete Account</div>
                        <div className="text-xs text-muted-foreground">
                          Permanently delete your account and all your data
                        </div>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
