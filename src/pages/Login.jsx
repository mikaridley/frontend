import { useState } from 'react'
import { useNavigate } from 'react-router'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

import { login } from '../store/actions/user.actions'

export function Login() {
    const [credentials, setCredentials] = useState({ email: '' })
    const navigate = useNavigate()

    async function onLogin(ev, creds = credentials) {
        if (ev) ev.preventDefault()

        if (!creds.email) return
        await login(creds)
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
        <section className='login'>
            <form className="login-form" onSubmit={onLogin}>
                <h1>Signup to continue</h1>
                <input type='email' required onChange={handleChange} />
                <button>Login</button>

                {true && <GoogleLogin
                    onSuccess={credentialResponse => handleGoogleLogin(credentialResponse)}
                    onError={() => console.log('Login Failed')}
                />}
            </form>
        </section>
    )
}