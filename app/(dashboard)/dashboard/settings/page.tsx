"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useUpdateUserMeMutation } from "@/redux/features/user/userApi";
import {
  Facebook,
  Instagram,
  Linkedin,
  X,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  Camera,
  Save,
  XCircle,
  Loader2,
  Edit2,
  ShieldCheck,
  Globe,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";

export default function ProfilePage() {
  const { data: userResponse, isLoading } = useGetMeQuery(undefined);
  const user = userResponse?.data?.user || userResponse;
  const [updateUserMe, { isLoading: updating }] = useUpdateUserMeMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    cityState: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        cityState: user.cityState || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <UserIcon size={24} className="text-primary animate-pulse" />
          </div>
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
          Synchronizing Registry...
        </p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating foundation registry...");
    try {
      await updateUserMe(formData).unwrap();
      setIsEditing(false);
      toast.success("Identity profile synchronized successfully ✅", { id: toastId });
    } catch (err) {
      toast.error("Process failed: Protocol violation ❌", { id: toastId });
    }
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0D9488&color=fff&size=256&bold=true`;

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <AFPageHeader
        title="Personal Registry"
        description="Manage your account profile, verified contact credentials, and regional settings."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <Card className="overflow-hidden border-none shadow-3xl bg-card/40 backdrop-blur-xl border border-muted/20 rounded-[3rem]">
            <div className="p-10 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative">
                  <img
                    src={formData.avatar || user?.avatar || defaultAvatar}
                    className="w-40 h-40 rounded-[2.5rem] border-4 border-background shadow-2xl object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    alt="Identity Avatar"
                  />
                  {isEditing && (
                    <div className="absolute bottom-2 right-2 flex gap-2">
                       <div className="relative">
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               const tid = toast.loading("Uploading new visual identity...");
                               setUploadingAvatar(true);
                               try {
                                 const fData = new FormData();
                                 fData.append("file", file);
                                 fData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
                                 const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                                   method: "POST",
                                   body: fData,
                                 });
                                 const result = await res.json();
                                 setFormData(prev => ({ ...prev, avatar: result.secure_url }));
                                 toast.success("Avatar uploaded. Commit changes to save.", { id: tid });
                               } catch (error) {
                                 toast.error("Upload failed.", { id: tid });
                               } finally {
                                 setUploadingAvatar(false);
                               }
                            }}
                          />
                          <button disabled={uploadingAvatar} className="bg-primary text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-all shadow-primary/30 flex items-center justify-center">
                            {uploadingAvatar ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <h2 className="text-3xl font-black text-foreground tracking-tighter">
                  {user?.name}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-4 py-1.5 rounded-full">
                    {user?.role}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-black uppercase px-4 py-1.5 rounded-full flex items-center gap-1">
                    <ShieldCheck size={10} /> {user?.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-10 w-full space-y-4">
                <div className="flex items-center gap-4 p-5 bg-muted/20 rounded-2xl border border-muted/30 group">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <Mail size={18} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Identity Email</p>
                    <p className="text-sm font-bold truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-muted/20 rounded-2xl border border-muted/30 group">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                    <Phone size={18} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Verified Phone</p>
                    <p className="text-sm font-bold">{user?.phone || "Pending Linking..."}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 pt-0">
              <Button
                size="lg"
                variant={isEditing ? "destructive" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-[0.2em] border-2 shadow-sm transition-all hover:scale-[1.02] active:scale-95"
              >
                {isEditing ? (
                  <>
                    <XCircle size={18} className="mr-3" /> Abort Changes
                  </>
                ) : (
                  <>
                    <Edit2 size={18} className="mr-3" /> Edit Protocol
                  </>
                )}
              </Button>
            </div>
          </Card>

          <div className="p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
               <ShieldCheck size={120} className="text-primary" />
            </div>
            <h4 className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <ShieldCheck size={16} /> Security Node
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-bold">
              Your profile is secured with bank-grade AES-256 encryption. Changes to your core identity require manual verification by the board to maintain trust.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden min-h-[600px] bg-card/40 backdrop-blur-xl border border-muted/20">
            <div className="p-10 border-b border-muted/30 bg-primary/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-primary flex items-center gap-3 uppercase tracking-[0.3em]">
                <UserIcon size={20} />
                Global Infrastructure Registry
              </h3>
              {user?.status === "ACTIVE" && (
                 <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 animate-pulse">
                    Verified Agent
                 </Badge>
              )}
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    Legal Identity
                  </label>
                  {isEditing ? (
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter legal name..."
                      className="w-full bg-muted/20 border-2 border-transparent focus:border-primary/40 rounded-2xl h-16 px-6 text-sm font-black focus:outline-none transition-all focus:bg-background shadow-inner"
                    />
                  ) : (
                    <div className="h-16 flex items-center px-6 bg-muted/10 rounded-2xl text-sm font-black border border-muted/20 group hover:border-primary/30 transition-colors">
                      {user?.name}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    Anchor Protocol (Email)
                  </label>
                  <div className="h-16 flex items-center px-6 bg-muted/5 rounded-2xl text-sm font-black text-muted-foreground/60 border border-dashed border-muted/40 italic cursor-not-allowed">
                    {user?.email}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    Contact Sequence
                  </label>
                  {isEditing ? (
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1XXX-XXXXXX"
                      className="w-full bg-muted/20 border-2 border-transparent focus:border-primary/40 rounded-2xl h-16 px-6 text-sm font-black focus:outline-none transition-all focus:bg-background shadow-inner"
                    />
                  ) : (
                    <div className="h-16 flex items-center px-6 bg-muted/10 rounded-2xl text-sm font-black border border-muted/20 group hover:border-primary/30 transition-colors">
                      {user?.phone || "Registry Incomplete"}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    Territorial Zone
                  </label>
                  {isEditing ? (
                    <input
                      name="cityState"
                      value={formData.cityState}
                      onChange={handleChange}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full bg-muted/20 border-2 border-transparent focus:border-primary/40 rounded-2xl h-16 px-6 text-sm font-black focus:outline-none transition-all focus:bg-background shadow-inner"
                    />
                  ) : (
                    <div className="h-16 flex items-center px-6 bg-muted/10 rounded-2xl text-sm font-black border border-muted/20 group hover:border-primary/30 transition-colors">
                      {user?.cityState || "Global Resident"}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                    Physical Credentials (Address)
                  </label>
                  {isEditing ? (
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full residency detailed address..."
                      className="w-full bg-muted/20 border-2 border-transparent focus:border-primary/40 rounded-2xl h-16 px-6 text-sm font-black focus:outline-none transition-all focus:bg-background shadow-inner"
                    />
                  ) : (
                    <div className="min-h-[4rem] flex items-center px-6 bg-muted/10 rounded-2xl text-sm font-black border border-muted/20 py-4 leading-relaxed group hover:border-primary/30 transition-colors">
                      {user?.address || "Physical credentials not recorded in foundation database."}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="pt-12 flex justify-end">
                  <Button
                    size="lg"
                    className="rounded-3xl px-16 h-18 font-black shadow-2xl shadow-primary/30 text-xs tracking-[0.2em] uppercase scale-100 hover:scale-[1.03] transition-all active:scale-95 bg-primary relative overflow-hidden group/btn"
                    onClick={handleUpdate}
                    disabled={updating || uploadingAvatar}
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 skew-x-12" />
                    {updating ? (
                      <>
                        <Loader2 className="mr-3 animate-spin h-5 w-5" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Save className="mr-3 h-5 w-5" />
                        Commit Profile
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {!isEditing && (
                <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="p-6 rounded-[2rem] border border-muted/30 flex flex-col items-center gap-3 text-center">
                    <Globe size={24} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Decentralized Storage Verified</span>
                  </div>
                   <div className="p-6 rounded-[2rem] border border-muted/30 flex flex-col items-center gap-3 text-center">
                    <ShieldCheck size={24} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Board Membership Level</span>
                  </div>
                   <div className="p-6 rounded-[2rem] border border-muted/30 flex flex-col items-center gap-3 text-center">
                    <Globe size={24} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Realtime Data Syncing</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
