"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGetMeQuery } from "@/redux/features/auth/authApi"
import { useUpdateUserMeMutation, } from "@/redux/features/user/userApi"
import { Facebook, Instagram, Linkedin, X } from "lucide-react"

export default function ProfilePage() {
  const { data: user, isLoading } = useGetMeQuery(undefined)
  const [updateUserMe, { isLoading: updating }] = useUpdateUserMeMutation()

  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    cityState: "",
  })

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

  if (isLoading) return <p className="p-6">Loading profile...</p>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    try {
      await updateUserMe(
       
    formData
    ).unwrap()

      setIsEditing(false)
      alert("Profile updated successfully ✅")
    } catch (err) {
      console.error(err)
      alert("Update failed ❌")
    }
  }

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">

        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        {/* Profile Card */}
        <Card className="mb-8">
          <div className="p-6 flex justify-between gap-6">
            <div className="flex gap-4">
              <img
                src={user?.avatar || "/avatar.png"}
                className="w-24 h-24 rounded-full border"
                alt="avatar"
              />

              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 items-end">
           

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                ✏️ {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Personal Info */}
        <Card className="mb-8">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div>
                <label className="text-sm text-blue-600">Name</label>
                {isEditing ? (
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="font-medium">{user?.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-blue-600">Email</label>
                <p className="font-medium">{user?.email}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-blue-600">Phone</label>
                {isEditing ? (
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="font-medium">{user?.phone || "N/A"}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="text-sm text-blue-600">Address</label>
                {isEditing ? (
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="font-medium">{user?.address || "N/A"}</p>
                )}
              </div>

              {/* City/State */}
              <div>
                <label className="text-sm text-blue-600">City / State</label>
                {isEditing ? (
                  <input
                    name="cityState"
                    value={formData.cityState}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="font-medium">{user?.cityState || "N/A"}</p>
                )}
              </div>

            </div>

            {isEditing && (
              <Button
                className="mt-6"
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
