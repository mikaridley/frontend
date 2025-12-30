import Lottie from 'lottie-react'

export function AiAgent({ toggleIsOpen }) {
  return (
    <div className="ai-agent">
      <Lottie
        animationData={null}
        path="/animations/robot.json"
        loop={true}
        autoplay={true}
        onClick={toggleIsOpen}
      />
    </div>
  )
}
