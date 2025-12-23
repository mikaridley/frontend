import { useState } from 'react'
import { useNavigate } from 'react-router'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

import { signup } from '../store/actions/user.actions'
import { userService } from '../services/user'

export function Signup() {
  const [credentials, setCredentials] = useState(userService.getEmptyUser())
  const navigate = useNavigate()

  function clearState() {
    setCredentials({ email: '' })
  }

  function handleChange({ target }) {
    const value = target.value
    setCredentials({ email: value })
  }

  async function onSignup(ev, creds = credentials) {
    if (ev) ev.preventDefault()

    if (!creds.email) return

    await signup(creds)
    clearState()
    navigate('/board')
  }

  function handleGoogleLogin(credentialResponse) {
    const { email, name, picture } = jwtDecode(credentialResponse.credential)
    setCredentials({ email, fullname: name, imgUrl: picture })
    onSignup(null, { email, fullname: name, imgUrl: picture })
  }

  return (
    <section className='login'>
      <form className="login-form" onSubmit={onSignup}>
        <h1>Login to continue</h1>
        <input type='email' required onChange={handleChange} />
        <button>Signup</button>

        {true && <GoogleLogin
          onSuccess={credentialResponse => handleGoogleLogin(credentialResponse)}
          onError={() => console.log('Login Failed')}
        />}
      </form>
    </section>
  )
}
