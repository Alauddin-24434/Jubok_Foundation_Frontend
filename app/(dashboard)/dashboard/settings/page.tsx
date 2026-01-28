"use client"

//==================================================================================
//                               USER PROFILE & SETTINGS
//==================================================================================
// Description: Internal account management interface for personal data and security.
// Features: Dynamic editing, real-time feedback, and social proof integration.
//==================================================================================

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGetMeQuery } from "@/redux/features/auth/authApi"
import { useUpdateUserMeMutation, } from "@/redux/features/user/userApi"
import { Facebook, Instagram, Linkedin, X, Mail, Phone, MapPin, User as UserIcon, Camera, Save, XCircle, Loader2, Edit2 } from "lucide-react"
import { toast } from "sonner"
import { AFPageHeader } from "@/components/shared/AFPageHeader"

export default function ProfilePage() {
  //======================   STATE & HOOKS   ===============================
  const { data: user, isLoading } = useGetMeQuery(undefined)
  const [updateUserMe, { isLoading: updating }] = useUpdateUserMeMutation()

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    cityState: "",
  })

  //======================   LIFECYCLE   ===============================
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        cityState: user.cityState || "",
      })
    }
  }, [user])

  //======================   RENDER HELPERS   ===============================
  if (isLoading) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
        <p className="text-muted-foreground font-bold italic animate-pulse tracking-tight">Accessing personal vault...</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    const toastId = toast.loading("Encrypting and saving profile metadata...");
    try {
      await updateUserMe(formData).unwrap()
      setIsEditing(false)
      toast.success("Identity profile updated and synchronized successfully ✅", { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error("Process failed: Internal security handshake error ❌", { id: toastId })
    }
  }

  //======================   MAIN VIEW   ===============================
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Dynamic Header Section */}
      <AFPageHeader 
        title="Personal Sovereignty"
        description="Manage your account profile, contact credentials, and regional settings."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Visual Card (Left) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-b from-primary/10 to-card">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative group">
                <img
                  src={user?.avatar || "/avatar.png"}
                  className="w-32 h-32 rounded-3xl border-4 border-background shadow-xl object-cover transition-transform group-hover:scale-105"
                  alt="Identity Avatar"
                />
                <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform shadow-primary/20">
                   <Camera size={16} />
                </button>
              </div>

              <div className="mt-6 space-y-1">
                <h2 className="text-2xl font-black text-foreground tracking-tight">{user?.name}</h2>
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-3 py-1">
                  {user?.role || "Member"}
                </Badge>
              </div>

              <div className="mt-8 w-full flex flex-col gap-2">
                 <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl text-left border border-muted/30">
                    <Mail size={16} className="text-primary/60" />
                    <span className="text-xs font-bold truncate">{user?.email}</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl text-left border border-muted/30">
                    <Phone size={16} className="text-primary/60" />
                    <span className="text-xs font-bold">{user?.phone || "No phone linked"}</span>
                 </div>
              </div>
            </div>
            
            <div className="p-6 pt-0 flex flex-col gap-3">
              <Button
                size="lg"
                variant={isEditing ? "destructive" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className="w-full rounded-xl font-bold border-2"
              >
                {isEditing ? <><XCircle size={18} className="mr-2" /> Discard Changes</> : <><Edit2 size={18} className="mr-2" /> Modify Profile</>}
              </Button>
            </div>
          </Card>

          {/* Account Status Tip */}
          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <h4 className="text-blue-600 font-bold text-sm mb-2">Account Verification</h4>
            <p className="text-xs text-blue-700/70 leading-relaxed font-medium">
              Your identity is currently <b>{user?.status?.toLowerCase()}</b>. Verified accounts receive priority access to new projects.
            </p>
          </div>
        </div>

        {/* Data Management Section (Right) */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden min-h-[500px]">
            <div className="p-8 border-b border-muted/30 bg-muted/5">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2 uppercase tracking-widest text-[13px]">
                <UserIcon size={18} className="text-primary" />
                Personal Registry
              </h3>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">

                {/* Name Attribute */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1">Legal Full Name</label>
                  {isEditing ? (
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-muted/20 border-2 border-transparent focus:border-primary/30 rounded-2xl h-12 px-5 text-sm font-bold focus:outline-none transition-all"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-5 bg-muted/10 rounded-2xl text-sm font-bold border border-muted/50">
                      {user?.name}
                    </div>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1">Anchor Email</label>
                  <div className="h-12 flex items-center px-5 bg-muted/10 rounded-2xl text-sm font-bold text-muted-foreground border border-muted/20 italic">
                    {user?.email}
                  </div>
                </div>

                {/* Phone Attribute */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1">Contact Sequence</label>
                  {isEditing ? (
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-muted/20 border-2 border-transparent focus:border-primary/30 rounded-2xl h-12 px-5 text-sm font-bold focus:outline-none transition-all"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-5 bg-muted/10 rounded-2xl text-sm font-bold border border-muted/50">
                      {user?.phone || "Undefined"}
                    </div>
                  )}
                </div>

                {/* City/State Attribute */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1">Territory / Region</label>
                  {isEditing ? (
                    <input
                      name="cityState"
                      value={formData.cityState}
                      onChange={handleChange}
                      className="w-full bg-muted/20 border-2 border-transparent focus:border-primary/30 rounded-2xl h-12 px-5 text-sm font-bold focus:outline-none transition-all"
                    />
                  ) : (
                    <div className="h-12 flex items-center px-5 bg-muted/10 rounded-2xl text-sm font-bold border border-muted/50">
                      {user?.cityState || "Global Resident"}
                    </div>
                  )}
                </div>

                {/* Full Address Attribute */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-primary uppercase tracking-widest ml-1">Living Protocol (Address)</label>
                  {isEditing ? (
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-muted/20 border-2 border-transparent focus:border-primary/30 rounded-2xl h-12 px-5 text-sm font-bold focus:outline-none transition-all"
                    />
                  ) : (
                    <div className="min-h-[3rem] flex items-center px-5 bg-muted/10 rounded-2xl text-sm font-bold border border-muted/50 py-3 leading-relaxed">
                      {user?.address || "Physical credentials not provided."}
                    </div>
                  )}
                </div>

              </div>

              {isEditing && (
                <div className="mt-12 flex justify-end">
                  <Button
                    size="lg"
                    className="rounded-2xl px-12 h-14 font-black shadow-xl shadow-primary/30 text-base scale-100 hover:scale-[1.03] transition-transform active:scale-95 bg-primary"
                    onClick={handleUpdate}
                    disabled={updating}
                  >
                    {updating ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                    {updating ? "Syncing..." : "Commit Profile Changes"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

