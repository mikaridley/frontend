import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'

import { login, signup } from '../store/actions/user.actions'

export function LoginSignup() {
    const { pathname } = useLocation()
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    async function onLogin(ev, creds = credentials) {
        if (ev) ev.preventDefault()
        if (!creds.email) return

        if (pathname === '/login') await login(creds)
        else await signup(creds)

        navigate('/board')
    }

    function handleChange({ target }) {
        const value = target.value
        setCredentials({ email: value })
    }

    function handleGoogleLogin(credentialResponse) {
        const { email, name, picture } = jwtDecode(credentialResponse.credential)
        onLogin(null, { email, fullname: name, imgUrl: picture })
    }

    return (
        <section className='login-signup'>
            <div>
                <form className="login-form" onSubmit={onLogin}>
                    <h1>Signup to continue</h1>
                    <input type='email' required onChange={handleChange} />
                    <button>Login</button>

                    {true && <GoogleLogin
                        onSuccess={credentialResponse => handleGoogleLogin(credentialResponse)}
                        onError={() => console.log('Login Failed')}
                    />}
                </form>
                {pathname === '/login'
                    ? <Link to='/signup'><p>Create an account</p></Link>
                    : <Link to='/login'><p>Already have an account? Log in</p></Link>}
            </div>
        </section>
    )
}