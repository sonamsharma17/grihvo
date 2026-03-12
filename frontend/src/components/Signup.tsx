import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'
import { signup } from '../api/authService'
import { useTranslation } from 'react-i18next'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'customer'
  })

  /* Error and Loading States */
  const [error, setError] = useState('')
  const [isCreated, setIsCreated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    /* Clear error when user starts typing */
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Phone number validation
    if (formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits!')
      return
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    // Call API
    setIsLoading(true)
    setError('')

    try {
      const response = await signup({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        password: formData.password
      })

      if (response.success) {
        setIsCreated(true)
        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
          navigate('/')
        }, 1500)
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-start justify-center px-4 pt-14 pb-6 lg:min-h-screen lg:items-center lg:py-20">
      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(
            circle at center, 
            rgba(120, 66, 18, 0.4) 0%, 
            #1a120b 85%
          )`
        }}
      />

      <div className="max-w-md w-full">

        <div className="text-center mb-4 lg:mb-8">

          <h1 className="text-2xl lg:text-4xl font-black text-amber-100 mb-1 lg:mb-2">
            {t('auth.signup_heading')} <span className="text-transparent bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text">{t('auth.signup_heading_highlight')}</span>
          </h1>
          <p className="text-amber-100/70 text-xs lg:text-base">{t('auth.signup_subheading')}</p>
        </div>

        {/* Signup Form */}
        <div className="bg-[#2d1a0a]/40 backdrop-blur-md border border-amber-500/20 rounded-2xl p-4 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-5">
            {/* User Type Selection */}



            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                {t('auth.fullname')}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors"
                  placeholder={t('auth.fullname_placeholder')}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                {t('auth.email')} <span className="text-amber-100/40 text-xs font-normal">{t('auth.email_optional')}</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors"
                  placeholder={t('auth.email_placeholder')}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                {t('auth.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-4 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors"
                  placeholder={t('auth.phone_placeholder')}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-12 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors"
                  placeholder={t('auth.create_password')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-amber-100/80 mb-2 text-sm font-semibold">
                {t('auth.confirm_password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400/60" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#1a120b]/60 border border-amber-500/30 rounded-lg pl-12 pr-12 py-3 text-amber-100 placeholder-amber-100/40 focus:outline-none focus:border-amber-500/60 transition-colors"
                  placeholder={t('auth.confirm_password_placeholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 rounded border-amber-500/30 bg-[#1a120b]/60 text-amber-500 focus:ring-amber-500/50"
                required
              />
              <span className="text-amber-100/70 text-sm">
                {t('auth.agree')}{' '}
                <a href="#" className="text-amber-400 hover:text-amber-300 font-semibold">
                  {t('auth.terms')}
                </a>{' '}
                {t('auth.and')}{' '}
                <a href="#" className="text-amber-400 hover:text-amber-300 font-semibold">
                  {t('auth.privacy')}
                </a>
              </span>
            </label>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCreated || isLoading}
              className={`w-full font-bold px-8 py-3 rounded-full shadow-lg transition-all duration-300 ${isCreated
                ? 'bg-yellow-500 text-white cursor-not-allowed'
                : isLoading
                  ? 'bg-amber-400 text-[#1a120b] cursor-wait opacity-70'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-[#1a120b] hover:shadow-xl hover:scale-105'
                }`}
            >
              {isCreated ? t('auth.signed_up') : isLoading ? t('auth.signing_up') : t('auth.signup_btn')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-500/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#2d1a0a]/40 text-amber-100/60">{t('auth.or_signup')}</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg py-3 text-amber-100 hover:bg-[#1a120b]/80 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-sm font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#1a120b]/60 border border-amber-500/30 rounded-lg py-3 text-amber-100 hover:bg-[#1a120b]/80 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-semibold">Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-amber-100/70">
            {t('auth.has_account')}{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              {t('auth.signin_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
