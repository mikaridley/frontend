import homeImg from '../assets/img/home-page-photo.png'

export function HomePage() {
  return (
    <section className="home-page">
      <div className="second-header">
        Accelerate your teams' work with AI features 🤖 now available for all
        Premium and Enterprise! <a>Learn more</a>.
      </div>
      <section className="home-main-content">
        <div className="home-sign-up">
          <h2>Capture, organize, and tackle your to-dos from anywhere.</h2>
          <h3>
            Escape the clutter and chaos—unleash your productivity with Trello.
          </h3>
          <form>
            <input type="text" placeholder="Email" />
            <button>Sign up - it's free!</button>
          </form>
          <p>
            By entering my email, I acknowledge the{' '}
            <a>Atlassian Privacy Policy</a>
          </p>
        </div>
        <img src={homeImg} />
      </section>
    </section>
  )
}
