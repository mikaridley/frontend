import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { GoogleLogin } from '@react-oauth/google'
import { Link } from 'react-router-dom'

import { login, signup, loginWithGoogle } from '../store/actions/user.actions'
import { userService } from '../services/user'
import { showErrorMsg } from '../services/event-bus.service'

import leftImg from '../assets/img/login-page-left.png'
import rightImg from '../assets/img/login-page-right.png'
import logoImg from '../assets/img/logo-dark.png'

export function LoginSignup() {
  const { pathname } = useLocation()
  const [credentials, setCredentials] = useState(userService.getEmptyUser())
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(ev) {
    ev.preventDefault()
    setError(null)

    if (!credentials.email) return setError('Email is required')

    try {
      let user
      if (pathname === '/login') user = await login(credentials)
      else user = await signup(credentials)

      if (!user) {
        setError('Could not log in. Please check your credentials.')
        return
      }

      navigate('/board')
    } catch (err) {
      console.error('Login/Signup Error:', err)

      const errorMsg =
        err.userMessage ||
        err.response?.data?.err ||
        err.response?.data?.message ||
        err.message ||
        'Login failed. Check your credentials.'

      setError(errorMsg)
      showErrorMsg(errorMsg)
    }
  }

  function handleChange({ target }) {
    const { name, value } = target
    if (error) setError(null)
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  async function handleGoogleLogin(credentialResponse) {
    setError(null)
    try {
      // Send the ID token directly to backend for verification
      const user = await loginWithGoogle(credentialResponse.credential)
      if (!user) {
        setError('Google login failed')
        return
      }
      navigate('/board')
    } catch (err) {
      console.error('Google Login Error:', err)
      
      const errorMsg =
        err.userMessage ||
        err.response?.data?.err ||
        err.response?.data?.message ||
        err.message ||
        'Google authentication failed. Please try again.'
      
      setError(errorMsg)
      showErrorMsg(errorMsg)
    }
  }

  const { email, password, fullname } = credentials

  return (
    <section className="login-signup grid">
      <img src={leftImg} />
      <form className="login-form grid" onSubmit={handleSubmit}>
        <img src={logoImg} />
        {pathname === '/login' ? (
          <h1>Log in to continue</h1>
        ) : (
          <h1>Sign up to continue</h1>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="login-form-input">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
        </div>
        {pathname === '/signup' && (
          <div className="login-form-input">
            <label htmlFor="fullname">Fullname</label>
            <input
              type="fullname"
              name="fullname"
              value={fullname}
              placeholder="Enter your fullname"
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="login-form-input">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="Enter password"
            onChange={handleChange}
            required
          />
        </div>

        {pathname === '/login' ? (
          <button>Continue</button>
        ) : (
          <button>Sign up</button>
        )}
        {true && (
          <GoogleLogin
            onSuccess={credentialResponse =>
              handleGoogleLogin(credentialResponse)
            }
            onError={() => {
              console.error('[Google Login Error]: Authentication failed')
              showErrorMsg('Google authentication failed. Please try again.')
            }}
            width={320}
          />
        )}
        {pathname === '/login' ? (
          <Link to="/signup" className="link">
            Create an account
          </Link>
        ) : (
          <Link to="/login" className="link">
            Already have an account? Log in
          </Link>
        )}
      </form>
      <img src={rightImg} />
    </section>
  )
}
