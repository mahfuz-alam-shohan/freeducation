import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, GraduationCap, Shield, User, Mail, Calendar, Lock } from 'lucide-react'

export const DesktopFirstAdminSetup = () => {
  const { registerFirstAdmin } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const result = await registerFirstAdmin({
        name: data.name,
        email: data.email,
        password: data.password,
        date_of_birth: data.date_of_birth
      })

      if (result.success) {
        toast.success('First admin registered successfully!')
      } else {
        toast.error(result.error || 'Registration failed')
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-full mb-6 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-3">freeducation</h1>
          <p className="text-secondary-600 text-lg">Setup your administrator account</p>
          <div className="flex items-center justify-center mt-4 text-amber-600">
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">One-time setup - This form will disappear after first admin creation</span>
          </div>
        </div>

        {/* Form */}
        <div className="card shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Name */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="input-field pl-12 text-base"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="input-field pl-12 text-base"
                    placeholder="admin@freeducation.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    {...register('date_of_birth', { required: 'Date of birth is required' })}
                    type="date"
                    className="input-field pl-12 text-base"
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-red-500 text-sm mt-2">{errors.date_of_birth.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-12 pr-12 text-base"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-secondary-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    {...register('confirmPassword', { required: 'Please confirm your password' })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="input-field pl-12 pr-12 text-base"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
              ) : null}
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-amber-700">
                <p className="font-semibold mb-2">🔒 Security Notice</p>
                <p>This is a one-time setup for creating the first administrator account. After successful registration, this setup form will be permanently disabled for security reasons.</p>
                <p className="mt-2 font-medium">Please ensure you use a strong, unique password.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
