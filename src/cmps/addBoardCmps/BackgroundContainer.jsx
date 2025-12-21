import { useEffect, useState } from 'react'
import { boardService } from '../../services/board/board.service.local'
import { MiniBoardPreview } from './MiniBoardPreview'
import { BackgroundPreview } from './BackgroundPreview'
import { PhotosBackground } from './PhotosBackground.jsx'

export function BackgroundContainer({ changeColor }) {
  const backgrounds = boardService.getBackgrounds()
  const gradiantColors = backgrounds.gradiantColors

  const [photosBg, setPhotosBg] = useState([])
  const [selectedColor, setSelectedColor] = useState('#0079bf')
  const [isOpenMoreBgs, setIsOpenMoreBgs] = useState({
    isOpen: false,
    openKind: '',
  })

  useEffect(() => {
    getPhotos()
  }, [])

  async function getPhotos() {
    try {
      const photos = await boardService.getBoardBackgrounds()
      setPhotosBg(photos)
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
                color={photo.imageUrl}
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
                        color={photo.imageUrl}
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
                openToggle={openMoreColors}
                goBack={openBoardBackground}
                selectedColor={selectedColor}
                onChangeBackground={onChangeBackground}
              />
            )}
            {isOpenMoreBgs.openKind === 'colors' && (
              <div calssName="colors-background">
                <section className="gradiant-colors">
                  <div className="background-header">
                    <p
                      className="back-btn-open-more-bgs"
                      onClick={() => {
                        openBgsToggle('')
                      }}
                    >
                      &lt;
                    </p>
                    <h2>Colors</h2>
                    <p onClick={openMoreColors}>X</p>
                  </div>
                  {backgrounds.gradiantColors.map(color => {
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
                <section className="solid-colors">
                  {backgrounds.solidColors.map(color => {
                    return (
                      <BackgroundPreview
                        color={color}
                        selectedColor={selectedColor.color}
                        key={color}
                        onChangeBackground={onChangeBackground}
                        kind={'solid'}
                      />
                    )
                  })}
                </section>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  )
}
