import { useSelector } from 'react-redux'
import { BackgroundPreview } from './BackgroundPreview'
import { PopUpHeader } from './PopUpHeader'

export function PhotosBackground({
  photosBg,
  onClose,
  goBack,
  selectedColor,
  onChangeBackground,
  backgroundLoad,
}) {
  return (
    <section className="photos-background">
      <PopUpHeader
        onBack={goBack}
        onClose={onClose}
        header={'Photos by Unsplash'}
      />
      {photosBg.map(photo => {
        return (
          <BackgroundPreview
            color={photo}
            selectedColor={selectedColor.color}
            key={photo.id}
            onChangeBackground={onChangeBackground}
            kind={'photo'}
            backgroundLoad={backgroundLoad}
          />
        )
      })}
    </section>
  )
}
