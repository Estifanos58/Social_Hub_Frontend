"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Shield, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import ImageUpload from "@/components/custom/ImageUpload";
import InputField from "@/components/shared/InputField";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PROFILE } from "@/graphql/mutations/user/UpdateProfile";
import { UpdateProfileMutation } from "@/gql/graphql";
import { toast } from "sonner"; 

export default function ProfileUpdatePage() {
  const { user, setUser } = useUserStore();
  const [updateProfile, { loading }] = useMutation<UpdateProfileMutation>(
    UPDATE_PROFILE
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatarUrl: "",
    isPrivate: false,
    twoFactorEnabled: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        email: user.email || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        isPrivate: user.isPrivate || false,
        twoFactorEnabled: false,
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    updateProfile({
      variables: {
        firstname: formData.firstName,
        lastname: formData.lastName,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        isPrivate: formData.isPrivate,
        twoFactorEnabled: formData.twoFactorEnabled,
      },
      onCompleted: (data) => {
        if (data.UpdateUser) {
          setUser(data.UpdateUser as any);
          toast.success("Profile updated successfully 🎉");
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong!");
      },
    });
  };

  return (
    <div className="min-h-screen flex-1 overflow-y-scroll bg-gray-900 text-gray-100">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {/* <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-200 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button> */}
          <div>
            <h1 className="text-3xl font-bold text-gray-100">
              Profile Settings
            </h1>
            <p className="text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Profile Image Section */}
          <Card className="bg-gray-900 border border-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Upload a profile picture to personalize your account
              </CardDescription>
            </CardHeader>
            <ImageUpload formData={formData} setFormData={setFormData} />
          </Card>

          {/* Personal Information */}
          <Card className="bg-gray-900 border border-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
                <InputField
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>

              <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-200">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px] resize-none bg-gray-800 border border-gray-700 text-gray-100 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-400">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-gray-900 border border-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Control your privacy settings and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Status */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="profile-status" className="text-gray-200">Profile Status</Label>
                    <Badge
                      variant={formData.isPrivate ? "secondary" : "default"}
                    >
                      {formData.isPrivate ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Private
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Public
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    {formData.isPrivate
                      ? "Your profile is only visible to you"
                      : "Your profile is visible to everyone"}
                  </p>
                </div>
                <Switch
                  id="profile-status"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) =>
                    handleInputChange("isPrivate", checked)
                  }
                />
              </div>

              <Separator />

              {/* Two Factor Authentication */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="two-factor" className="text-gray-200">
                      Two-Factor Authentication
                    </Label>
                    <Badge
                      variant={
                        formData.twoFactorEnabled ? "default" : "outline"
                      }
                      className="text-white"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {formData.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    handleInputChange("twoFactorEnabled", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button variant="outline" className="sm:w-auto text-black border border-gray-700">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="sm:w-auto bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
