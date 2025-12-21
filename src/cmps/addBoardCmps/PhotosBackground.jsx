import { BackgroundPreview } from './BackgroundPreview'

export function PhotosBackground({
  photosBg,
  openToggle,
  goBack,
  selectedColor,
  onChangeBackground,
}) {
  return (
    <section className="photos-background">
      <div className="background-header">
        <p className="back-btn-open-more-bgs" onClick={goBack}>
          &lt;
        </p>
        <h2>Photos by Unsplash</h2>
        <p onClick={openToggle}>X</p>
      </div>
      {photosBg.map(photo => {
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
  )
}
