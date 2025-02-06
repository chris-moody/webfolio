import { PixiWrapper } from '@/components/pixiWrapper/PixiWrapper'
import { useTheme } from '@mui/material'
import {
  Application,
  Assets,
  Color,
  DisplacementFilter,
  FillGradient,
  Sprite,
  Text,
  TextStyle,
} from 'pixi.js'
import { useCallback, useState } from 'react'

export interface WaterTextProps {
  value: string
}

export const WaterText = ({ value }: WaterTextProps) => {
  const [text, setText] = useState<Text | null>(null)
  const theme = useTheme()

  const preload = async () => {
    await Assets.load([{ alias: 'noise', src: '/noise.png' }])
  }

  const onResize = useCallback(
    (app: Application) => {
      if (!text) return
      text.x = app.screen.width / 2 - text.width / 2
      text.y = app.screen.height / 2 - text.height / 2
    },
    [text]
  )

  const onReady = useCallback(
    (app: Application) => {
      const fill = new FillGradient(0, 0, 0, 36 * 1.7 * 7)
      const colors = [0xffffff, theme.palette.primary.main].map((color) =>
        Color.shared.setValue(color).toNumber()
      )
      colors.forEach((number, index) => {
        const ratio = index / colors.length
        fill.addColorStop(ratio, number)
      })

      const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 56,
        fontStyle: 'italic',
        fontWeight: 'bold',
        align: 'center',
        fill: { fill },
        stroke: { color: '#4a1850', width: 5, join: 'round' },
        dropShadow: {
          color: '#000000',
          blur: 4,
          angle: Math.PI / 6,
          distance: 6,
        },
        wordWrap: true,
        wordWrapWidth: 220,
      })

      const richText = new Text({
        text: value,
        style,
      })

      richText.x = app.screen.width / 2 - richText.width / 2
      richText.y = app.screen.height / 2 - richText.height / 2
      setText(richText)

      app.stage.addChild(richText)

      const noiseSprite = Sprite.from('noise')
      noiseSprite.texture.source.addressMode = 'repeat'
      const filter = new DisplacementFilter({
        sprite: noiseSprite,
        scale: 50,
      })
      app.stage.filters = [filter]
      app.stage.addChild(noiseSprite)

      app.ticker.add(() => {
        noiseSprite.x += 1
        if (noiseSprite.x > noiseSprite.width) {
          noiseSprite.x = 0
        }
      })
    },
    [theme, value]
  )

  return <PixiWrapper preload={preload} onReady={onReady} onResize={onResize} />
}
