import Lottie from 'lottie-react'

export function MovingArrows() {
  return (
    <div className="moving-arrows">
      <Lottie
        animationData={null}
        path="/animations/arrows.json"
        loop={true}
        autoplay={true}
      />
    </div>
  )
}
