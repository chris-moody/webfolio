import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { FC, useRef, useState } from 'react'
import { FancyText, FancyTextProps } from '../fancyText/FancyText'

export interface TypeWriterProps extends FancyTextProps {
  text: string
  prefix?: string
  duration: number
}

export interface TweenTarget<T> {
  val: T
}

export const TypeWriter: FC<TypeWriterProps> = ({
  text = '',
  prefix = ' ',
  duration,
  ...props
}) => {
  const container = useRef<HTMLSpanElement>(null)
  const [textValue, setTextValue] = useState('')

  useGSAP(
    () => {
      if (!container.current) return

      const textTarget: TweenTarget<number> = { val: 0 }
      const tmln = gsap.timeline({ repeat: -1, yoyo: true })
      tmln.to(textTarget, {
        val: text.length,
        duration,
        ease: `steps(${text.length})`,
        onUpdate: () => {
          setTextValue(text.substring(0, textTarget.val))
        },
      })
    },
    { dependencies: [text, duration], scope: container }
  )
  return <FancyText ref={container} {...props} className="text">{prefix}{textValue}</FancyText>
}
