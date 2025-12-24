import homeImg from '../assets/img/home-page-photo.png'
import articleImg1 from '../assets/img/home-page-article1.png'
import articleImg2 from '../assets/img/home-page-article2.png'
import emailImg from '../assets/img/home-page-email-icon.png'
import messageImg from '../assets/img/home-page-msg-icon.png'

export function HomePage() {
  return (
    <section className="home-page">
      <div className="second-header">
        Accelerate your teams' work with AI features 🤖 now available for all
        Premium and Enterprise! <a>Learn more.</a>
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

      <section className="home-secondary-content">
        <header>
          <h2>From message to action</h2>
          <h3>
            Quickly turn communication from your favorite apps into to-dos,
            keeping all your discussions and tasks organized in one place.
          </h3>
        </header>

        <article>
          <img src={articleImg1} />
          <section className="article-content">
            <header>
              <img src={emailImg} />
              <h4>Email magic</h4>
            </header>
            <p>
              Easily turn your emails into to-dos! Just forward them to your
              Trello Inbox, and they’ll be transformed by AI into organized
              to-dos with all the links you need.
            </p>
          </section>
        </article>

        <article>
          <img src={articleImg2} />
          <section className="article-content">
            <header>
              <img src={messageImg} />
              <h4>Message app sorcery</h4>
            </header>
            <p>
              Need to follow up on a message from Slack or Microsoft Teams? Send
              it directly to your Trello board! Your favorite app interface lets
              you save messages that appear in your Trello Inbox with
              AI-generated summaries and links.
            </p>
          </section>
        </article>
      </section>
    </section>
  )
}
