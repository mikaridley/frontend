import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'

import { login, signup } from '../store/actions/user.actions'
import { userService } from '../services/user'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import leftImg from '../assets/img/login-page-left.png'
import rightImg from '../assets/img/login-page-right.png'
import logoImg from '../assets/img/logo-dark.png'

export function LoginSignup() {
    const { pathname } = useLocation()
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    async function handleSubmit(ev, creds = credentials) {
        if (ev) ev.preventDefault()

        if (!creds.email) return
        let user

        try {
            if (pathname === '/login') user = await login(creds)
            else user = await signup(creds)

            if (!user) return showErrorMsg('Could not log in')

            showSuccessMsg('Logged in successfully')
            navigate('/board')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Could not log in')
        }
    }

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    function handleGoogleLogin(credentialResponse) {
        const { email, name, picture } = jwtDecode(credentialResponse.credential)
        handleSubmit(null, { email, fullname: name, imgUrl: picture })
    }

    const { email, password, fullname } = credentials

    return (
        <section className="login-signup grid">
            <img src={leftImg} />
            <form className="login-form grid" onSubmit={handleSubmit}>

                <img src={logoImg} />
                {pathname === '/login'
                    ? <h1>Log in to continue</h1>
                    : <h1>Sign up to continue</h1>
                }

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
                {pathname === '/signup' &&
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
                }
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

                {pathname === '/login'
                    ? <button>Continue</button>
                    : <button>Sign up</button>

                }
                {true && <GoogleLogin
                    onSuccess={credentialResponse => handleGoogleLogin(credentialResponse)}
                    onError={() => console.log('Login Failed')}
                />}
                {pathname === '/login'
                    ? <Link to='/signup' className='link'>Create an account</Link>
                    : <Link to='/login' className='link'>Already have an account? Log in</Link>}
            </form>
            <img src={rightImg} />
        </section>
    )
}