import { useEffect, useState } from 'react'
import { boardService } from '../../services/board/board.service.local'
import { MiniBoardPreview } from './MiniBoardPreview'

export function BackgroundContainer({ changeColor }) {
  const backgrounds = boardService.getBackgrounds()
  const [solidColors, setSolidColors] = useState(backgrounds.solidColors)
  const [selectedColor, setSelectedColor] = useState('#0079bf')
  const [isOpenMoreColors, setIsOpenMoreColors] = useState(false)

  useEffect(() => {
    setSolidColors(setSolidColors => setSolidColors.slice(0, 5))
  }, [])

  function onChangeBackground(color) {
    setSelectedColor(color)
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
        {solidColors.map(color => {
          return (
            <div
              key={color}
              className={`background-color ${
                selectedColor === color ? 'active-background' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onChangeBackground(color)}
            ></div>
          )
        })}
        <div
          onClick={openMoreColors}
          className="background-color open-more-bg-colors"
        >
          ...
        </div>
        {isOpenMoreColors && (
          <div className="open-more-colors">
            {backgrounds.solidColors.map(color => {
              return (
                <div
                  key={color}
                  className={`background-color ${
                    selectedColor === color ? 'active-background' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onChangeBackground(color)}
                ></div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
