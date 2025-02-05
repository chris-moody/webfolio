import { Box, useTheme } from '@mui/material'
import {
  Application,
  ApplicationOptions,
  Assets,
  Color,
  DisplacementFilter,
  FillGradient,
  Sprite,
  Text,
  TextStyle,
} from 'pixi.js'
import { ReactNode, useCallback, useEffect, useRef } from 'react'

export const PixiWrapper = ({
  children,
  ...rest
}: Partial<ApplicationOptions> & { children?: ReactNode }) => {
  const container = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<Application | null>(null)
  const theme = useTheme()

  const preload = async () => {
    await Assets.load([{ alias: 'noise', src: '/noise.png' }])
  }

  const setup = useCallback(() => {
    if (!appRef.current) return
    const app = appRef.current

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
      fontSize: 48,
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
      text: 'I AM FEARLESS',
      style,
    })

    richText.x = app.screen.width / 2 - richText.width / 2
    richText.y = app.screen.height / 2 - richText.height / 2

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
  }, [theme])

  useEffect(() => {
    if (appRef.current) return

    const init = async () => {
      const app = new Application()
      appRef.current = app

      await app.init({
        backgroundAlpha: 0,
        ...(container.current && { resizeTo: container.current }),
        ...rest,
      })

      container.current?.appendChild(app.canvas)
      await preload()
      setup()
    }

    init()
  }, [rest, setup])

  return (
    <Box ref={container} sx={{ width: '100%', height: '100%' }}>
      {children}
    </Box>
  )
}
