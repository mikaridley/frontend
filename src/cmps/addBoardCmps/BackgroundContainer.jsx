import { useEffect, useState } from 'react'
import { boardService } from '../../services/board/board.service.local'
import { MiniBoardPreview } from './MiniBoardPreview'

export function BackgroundContainer({ changeColor }) {
  const backgrounds = boardService.getBackgrounds()
  const [solidColors, setSolidColors] = useState(backgrounds.solidColors)
  const [gradiantColors, setGradiantColors] = useState(
    backgrounds.gradiantColors
  )
  const [selectedColor, setSelectedColor] = useState('#0079bf')
  const [isOpenMoreColors, setIsOpenMoreColors] = useState(false)

  useEffect(() => {
    setGradiantColors(gradiantColors => gradiantColors.slice(0, 5))
  }, [])

  function onChangeBackground(color, kind) {
    setSelectedColor({ color, kind })
    changeColor(color)
  }

  function openMoreColors() {
    setIsOpenMoreColors(!isOpenMoreColors)
  }

  return (
    <>
      <MiniBoardPreview selectedColor={selectedColor} />
      <h3>Background</h3>
      <section className="background-container">
        {/* <section className="gradiant-container">
          {gradiantColors.map(color => {
            return (
              <div
                key={color}
                className={`background-color ${
                  selectedColor.color === color ? 'active-background' : ''
                }`}
                style={{ background: color }}
                onClick={() => onChangeBackground(color, 'gradiant')}
              ></div>
            )
          })}
        </section> */}

        <section className="color-container">
          {gradiantColors.map(color => {
            return (
              <div
                key={color}
                className={`background-color ${
                  selectedColor.color === color ? 'active-background' : ''
                }`}
                style={{ background: color }}
                onClick={() => onChangeBackground(color, 'gradiant')}
              ></div>
            )
          })}

          <div
            onClick={openMoreColors}
            className="background-color open-more-bg-colors"
          >
            ...
          </div>
        </section>
        {isOpenMoreColors && (
          <div className="open-more-colors">
            <section className="gradiant-colors">
              {backgrounds.gradiantColors.map(color => {
                return (
                  <div
                    key={color}
                    className={`background-color ${
                      selectedColor.color === color ? 'active-background' : ''
                    }`}
                    style={{ background: color }}
                    onClick={() => onChangeBackground(color, 'gradiant')}
                  ></div>
                )
              })}
            </section>
            <section className="solid-colors">
              {backgrounds.solidColors.map(color => {
                return (
                  <div
                    key={color}
                    className={`background-color ${
                      selectedColor.color === color ? 'active-background' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onChangeBackground(color, 'solid')}
                  ></div>
                )
              })}
            </section>
          </div>
        )}
      </section>
    </>
  )
}
