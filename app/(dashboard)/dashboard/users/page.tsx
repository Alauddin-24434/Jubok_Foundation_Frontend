'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal, Search, UserCheck, UserX, Trash2, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '@/redux/features/user/userApi'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const AVAILABLE_PERMISSIONS = [
  'manage_users',
  'manage_projects',
  'manage_banners',
  'view_analytics',
  'approve_payments',
  'manage_members'
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [editingUser, setEditingUser] = useState<any>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const { data: users, isLoading } = useGetUsersQuery({
    search: searchTerm,
    role: roleFilter === 'all' ? undefined : roleFilter
  })

  const [updateUser] = useUpdateUserMutation()
  const [deleteUser] = useDeleteUserMutation()

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUser({ id: userId, data: { role: newRole } }).unwrap()
      toast.success('User role updated successfully')
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUser({ id: userId, data: { status: newStatus } }).unwrap()
      toast.success('User status updated successfully')
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap()
        toast.success('User deleted successfully')
      } catch (error) {
        toast.error('Failed to delete user')
      }
    }
  }

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    )
  }

  const savePermissions = async () => {
    if (!editingUser) return
    try {
      await updateUser({ id: editingUser._id, data: { permissions: selectedPermissions } }).unwrap()
      toast.success('Permissions updated successfully')
      setEditingUser(null)
    } catch (error) {
      toast.error('Failed to update permissions')
    }
  }

  if (isLoading) return <div>Loading users...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-foreground/60 mt-1">Manage user roles and permissions</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
          <Input
            placeholder="Search users..."
            className="pl-10 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-10">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Moderator">Moderator</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px] md:min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user: any) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => handleRoleChange(user._id, value)}
                    >
                      <SelectTrigger className="w-[130px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {user.permissions?.length > 0 ? (
                        user.permissions.map((p: string) => (
                          <Badge key={p} variant="outline" className="text-[10px] px-1 h-5 capitalize">
                            {p.replace('_', ' ')}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={editingUser?._id === user._id} onOpenChange={(open) => {
                        if (open) {
                          setEditingUser(user)
                          setSelectedPermissions(user.permissions || [])
                        } else {
                          setEditingUser(null)
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Shield className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Permissions</DialogTitle>
                            <DialogDescription>
                              Select the permissions for {user.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {AVAILABLE_PERMISSIONS.map((permission) => (
                              <div key={permission} className="flex items-center space-x-2">
                                <Checkbox
                                  id={permission}
                                  checked={selectedPermissions.includes(permission)}
                                  onCheckedChange={() => handlePermissionToggle(permission)}
                                />
                                <Label htmlFor={permission} className="capitalize">
                                  {permission.replace(/_/g, ' ')}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                            <Button onClick={savePermissions}>Save changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user._id, user.status === 'active' ? 'suspended' : 'active')}
                          >
                            {user.status === 'active' ? (
                              <><UserX className="mr-2 h-4 w-4" /> Suspend</>
                            ) : (
                              <><UserCheck className="mr-2 h-4 w-4" /> Activate</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(user._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
