import { useEffect, useRef, useState } from 'react'
import { boardService } from '../../services/board'
import { MiniBoardPreview } from './MiniBoardPreview'
import { BackgroundPreview } from './BackgroundPreview'
import { PhotosBackground } from './PhotosBackground.jsx'
import { getColorsBg, getPhotos } from '../../store/actions/board.actions.js'
import { useSelector } from 'react-redux'
import { ColorsBackground } from './ColorsBackground.jsx'
import closeImg from '../../assets/img/close.svg'

export function BackgroundContainer({ changeColor, isForPreview = false }) {
  const backgrounds = getColorsBg()
  const gradientColors = backgrounds?.gradientColors || []

  const photosBg =
    useSelector(storeState => storeState.boardModule.backgroundPhotos) || []
  const [selectedColor, setSelectedColor] = useState('#0079bf')
  const [isOpenMoreBgs, setIsOpenMoreBgs] = useState({
    isOpen: false,
    openKind: '',
  })
  const moreColorsRef = useRef(null)

  useEffect(() => {
    _getPhotos()
  }, [])

  useEffect(() => {
    if (!moreColorsRef.current || !isOpenMoreBgs.isOpen) return

    const el = moreColorsRef.current
    const rect = el.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const padding = 12

    // Clamp TOP
    if (rect.top < padding) {
      el.style.top = `${padding}px`
      el.style.bottom = 'auto'
    }

    // Clamp BOTTOM
    if (rect.bottom > viewportHeight - padding) {
      el.style.bottom = `${padding}px`
      el.style.top = 'auto'
    }

    // Final safety height
    el.style.maxHeight = `${viewportHeight - padding * 2}px`
    el.style.overflowY = 'auto'
  }, [isOpenMoreBgs.isOpen, isOpenMoreBgs.openKind])

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
          {photosBg?.slice(0, 4).map(photo => {
            return (
              <BackgroundPreview
                color={photo}
                selectedColor={selectedColor.color}
                key={photo.id}
                onChangeBackground={onChangeBackground}
                kind={'photo'}
                isForPreview={isForPreview}
              />
            )
          })}
        </section>

        <section className="colors-background-preview">
          {gradientColors.slice(0, 5).map(color => {
            return (
              <BackgroundPreview
                color={color}
                selectedColor={selectedColor.color}
                key={color}
                onChangeBackground={onChangeBackground}
                kind={'gradient'}
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
          <div className="open-more-colors" ref={moreColorsRef}>
            {isOpenMoreBgs.openKind === '' && (
              <>
                <div className="board-bg-header">
                  <h2>Board background</h2>
                  <img onClick={openMoreColors} src={closeImg} />
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
                  {photosBg?.slice(0, 6).map(photo => {
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
                <section className="gradient-colors">
                  {backgrounds?.gradientColors?.slice(0, 6).map(color => {
                    return (
                      <BackgroundPreview
                        color={color}
                        selectedColor={selectedColor.color}
                        key={color}
                        onChangeBackground={onChangeBackground}
                        kind={'gradient'}
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
