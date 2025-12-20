import facebookImg from '../assets/img/facebook.svg'
import instagramImg from '../assets/img/instagram.svg'
import linkdinImg from '../assets/img/linkdin.svg'
import twitterImg from '../assets/img/twitter.svg'
import youtubeImg from '../assets/img/youtube.svg'
import logoLight from '../assets/img/logo-light.png'

export function AppFooter() {
  return (
    <section className="app-footer">
      <section className="footer-main">
        <img src={logoLight} />
        <h2>Your Privacy Choices</h2>
        <h2>Privacy Policy</h2>
        <h2>Terms</h2>
        <h2>Copyright © 2024 Atlassian</h2>
      </section>
      <section className="footer-social">
        <div className="icon-container">
          <img src={facebookImg} />
        </div>
        <div className="icon-container">
          <img src={instagramImg} />
        </div>
        <div className="icon-container">
          <img src={linkdinImg} />
        </div>
        <div className="icon-container">
          <img src={twitterImg} />
        </div>
        <div className="icon-container">
          <img src={youtubeImg} />
        </div>
      </section>
    </section>
  )
}
