import { useEffect, useState } from 'react'
import { boardService } from '../../services/board/board.service.local'
import { MiniBoardPreview } from './MiniBoardPreview'
import { BackgroundPreview } from './BackgroundPreview'
import { PhotosBackground } from './PhotosBackground.jsx'
import { getColorsBg, getPhotos } from '../../store/actions/board.actions.js'
import { useSelector } from 'react-redux'
import { SetBackgroundHeader } from './SetBackgroundHeader.jsx'
import { ColorsBackground } from './ColorsBackground.jsx'

export function BackgroundContainer({ changeColor }) {
  const backgrounds = getColorsBg()
  const gradiantColors = backgrounds.gradiantColors

  const photosBg = useSelector(
    storeState => storeState.boardModule.backgroundPhotos
  )
  const [selectedColor, setSelectedColor] = useState('#0079bf')
  const [isOpenMoreBgs, setIsOpenMoreBgs] = useState({
    isOpen: false,
    openKind: '',
  })

  useEffect(() => {
    _getPhotos()
  }, [])

  async function _getPhotos() {
    try {
      await getPhotos()
    } catch (err) {
      console.error('Failed to load backgrounds', err)
    }
  }

  function onChangeBackground(color, kind) {
    setSelectedColor({ color, kind })
    changeColor({ color, kind })
  }

  function openMoreColors() {
    setIsOpenMoreBgs({ ...isOpenMoreBgs, isOpen: !isOpenMoreBgs.isOpen })
  }

  function openBgsToggle(whereTo) {
    setIsOpenMoreBgs({
      ...isOpenMoreBgs,
      openKind: whereTo,
    })
  }

  function openBoardBackground() {
    openBgsToggle('')
  }

  return (
    <>
      <MiniBoardPreview selectedColor={selectedColor} />
      <h3>Background</h3>
      <section className="background-container">
        <section className="photos-background-preview">
          {photosBg.slice(0, 4).map(photo => {
            return (
              <BackgroundPreview
                color={photo}
                selectedColor={selectedColor.color}
                key={photo.id}
                onChangeBackground={onChangeBackground}
                kind={'photo'}
              />
            )
          })}
        </section>

        <section className="colors-background-preview">
          {gradiantColors.slice(0, 5).map(color => {
            return (
              <BackgroundPreview
                color={color}
                selectedColor={selectedColor.color}
                key={color}
                onChangeBackground={onChangeBackground}
                kind={'gradiant'}
              />
            )
          })}

          <div
            onClick={openMoreColors}
            className="background-color open-more-bg-colors"
          >
            ...
          </div>
        </section>
        {isOpenMoreBgs.isOpen && (
          <div className="open-more-colors">
            {isOpenMoreBgs.openKind === '' && (
              <>
                <div className="board-bg-header">
                  <h2>Board background</h2>
                  <p onClick={openMoreColors}>X</p>
                </div>
                <div className="open-more-header">
                  <h3>Photos</h3>
                  <button
                    onClick={() => {
                      openBgsToggle('photos')
                    }}
                  >
                    View more
                  </button>
                </div>
                <section className="photos-background">
                  {photosBg.slice(0, 6).map(photo => {
                    return (
                      <BackgroundPreview
                        color={photo}
                        selectedColor={selectedColor.color}
                        key={photo.id}
                        onChangeBackground={onChangeBackground}
                        kind={'photo'}
                      />
                    )
                  })}
                </section>

                <div className="open-more-header">
                  <h3>Colors</h3>
                  <button
                    onClick={() => {
                      openBgsToggle('colors')
                    }}
                  >
                    View more
                  </button>
                </div>
                <section className="gradiant-colors">
                  {backgrounds.gradiantColors.slice(0, 6).map(color => {
                    return (
                      <BackgroundPreview
                        color={color}
                        selectedColor={selectedColor.color}
                        key={color}
                        onChangeBackground={onChangeBackground}
                        kind={'gradiant'}
                      />
                    )
                  })}
                </section>
              </>
            )}
            {isOpenMoreBgs.openKind === 'photos' && (
              <PhotosBackground
                photosBg={photosBg}
                onClose={openMoreColors}
                goBack={openBoardBackground}
                selectedColor={selectedColor}
                onChangeBackground={onChangeBackground}
              />
            )}
            {isOpenMoreBgs.openKind === 'colors' && (
              <ColorsBackground
                onBack={openBoardBackground}
                onClose={openMoreColors}
                header={'Colors'}
                backgrounds={backgrounds}
                selectedColor={selectedColor}
                onChangeBackground={onChangeBackground}
              />
            )}
          </div>
        )}
      </section>
    </>
  )
}
