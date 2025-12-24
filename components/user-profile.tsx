"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "./auth-provider"
import { User, Mail, Building2, Briefcase, Phone, MapPin, Calendar, X } from "lucide-react"
import { toast } from "sonner"

interface UserProfileProps {
  onClose: () => void
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [organization, setOrganization] = useState(user?.organization || "")
  const [role, setRole] = useState(user?.role || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [country, setCountry] = useState(user?.country || "")

  const handleSave = () => {
    updateProfile({
      name,
      email,
      organization,
      role,
      phone,
      country,
    })
    setEditing(false)
    toast.success("Profile updated successfully")
  }

  const handleCancel = () => {
    setName(user?.name || "")
    setEmail(user?.email || "")
    setOrganization(user?.organization || "")
    setRole(user?.role || "")
    setPhone(user?.phone || "")
    setCountry(user?.country || "")
    setEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">User Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Placeholder */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-900 flex items-center justify-center text-white text-2xl font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900">{user?.name}</h3>
              <p className="text-sm text-slate-600">{user?.email}</p>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">Account Information</h4>
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                  Edit Profile
                </Button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="edit-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-organization">Organization</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="edit-organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger id="edit-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Government Planner">Government Planner</SelectItem>
                        <SelectItem value="NGO Manager">NGO Manager</SelectItem>
                        <SelectItem value="Real Estate Developer">Real Estate Developer</SelectItem>
                        <SelectItem value="Architect">Architect</SelectItem>
                        <SelectItem value="Consultant">Consultant</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="edit-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-country">Country</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="edit-country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} className="bg-blue-900 hover:bg-blue-800">
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 w-24">Name:</span>
                  <span className="text-slate-900 font-medium">{user?.name || "-"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 w-24">Email:</span>
                  <span className="text-slate-900 font-medium">{user?.email || "-"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 w-24">Organization:</span>
                  <span className="text-slate-900 font-medium">{user?.organization || "-"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 w-24">Role:</span>
                  <span className="text-slate-900 font-medium">{user?.role || "-"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 w-24">Phone:</span>
                  <span className="text-slate-900 font-medium">{user?.phone || "-"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 w-24">Country:</span>
                  <span className="text-slate-900 font-medium">{user?.country || "-"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 w-24">Member since:</span>
                  <span className="text-slate-900 font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
