import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { FC, useRef, useState } from 'react'
import { FancyText, FancyTextProps } from '../fancyText/FancyText'
import { useReducedMotion } from '@/motion/motion'

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
  const reduced = useReducedMotion()

  // Typing loops forever; reduced motion shows the finished text instead.
  useGSAP(
    () => {
      if (!container.current || reduced) return

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
    {
      dependencies: [text, duration, reduced],
      scope: container,
      revertOnUpdate: true,
    }
  )
  return (
    <FancyText fancy={{ depth: 7 }} ref={container} {...props} className="text">
      {prefix}
      {reduced ? text : textValue}
    </FancyText>
  )
}
