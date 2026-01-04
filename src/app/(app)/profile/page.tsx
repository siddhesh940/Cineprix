'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/demo-auth-context'
import { motion } from 'framer-motion'
import { AlertCircle, Calendar, CheckCircle, Mail, Save, Shield, User } from 'lucide-react'
import { useState } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.name || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { error: updateError } = await updateProfile({
      full_name: fullName
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Profile updated successfully!')
    }
    setLoading(false)
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 ring-1 ring-white/10">
          <User className="size-7 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>
      </motion.div>

      {/* Personal Information Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gray-900/40 border-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 ring-1 ring-blue-500/30">
                <User className="size-4 text-blue-400" />
              </div>
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                  <Mail className="size-4 text-gray-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-white/5 border-white/10 text-gray-400 cursor-not-allowed rounded-xl"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300 flex items-center gap-2">
                  <User className="size-4 text-gray-500" />
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-red-500/50 focus:ring-red-500/20"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-3"
                >
                  <div className="p-1.5 rounded-lg bg-red-500/20">
                    <AlertCircle className="size-4" />
                  </div>
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm flex items-center gap-3"
                >
                  <div className="p-1.5 rounded-lg bg-green-500/20">
                    <CheckCircle className="size-4" />
                  </div>
                  {success}
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl px-6 shadow-lg shadow-red-500/20"
                >
                  {loading ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="size-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Details Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gray-900/40 border-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-white flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 ring-1 ring-purple-500/30">
                <Shield className="size-4 text-purple-400" />
              </div>
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="text-gray-400 flex items-center gap-2">
                <Calendar className="size-4" />
                Account Created
              </span>
              <span className="text-white font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="text-gray-400 flex items-center gap-2">
                <Calendar className="size-4" />
                Last Sign In
              </span>
              <span className="text-white font-medium">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
              <span className="text-gray-400 flex items-center gap-2">
                <Shield className="size-4" />
                Auth Provider
              </span>
              <span className="text-white font-medium capitalize">
                {user?.app_metadata?.provider || 'Email'}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}