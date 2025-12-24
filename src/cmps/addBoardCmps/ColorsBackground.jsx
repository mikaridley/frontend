import { BackgroundPreview } from './BackgroundPreview'
import { SetBackgroundHeader } from './SetBackgroundHeader'

export function ColorsBackground({
  backgrounds,
  onBack,
  onClose,
  selectedColor,
  onChangeBackground,
}) {
  return (
    <div className="colors-background">
      <section className="gradient-colors">
        <SetBackgroundHeader
          onBack={onBack}
          onClose={onClose}
          header={'Colors'}
        />
        {backgrounds.gradientColors.map(color => {
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
  )
}
