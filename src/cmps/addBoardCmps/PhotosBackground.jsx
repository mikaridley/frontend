import { useSelector } from 'react-redux'
import { BackgroundPreview } from './BackgroundPreview'
import { SetBackgroundHeader } from './SetBackgroundHeader'

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
      <SetBackgroundHeader
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
