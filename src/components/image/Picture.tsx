import { styled } from '@mui/material'
import type { CSSProperties, FC } from 'react'

const Img = styled('img')({ width: '100%', height: 'auto', margin: '0 auto' })

export interface PictureSource {
  avif?: string
  webp: string
  /** Fallback for browsers without WebP (effectively none now). */
  fallback: string
}

export interface PictureProps {
  sources: PictureSource
  alt: string
  /** Intrinsic size of the largest rendition: reserves layout space (no CLS). */
  width: number
  height: number
  sizes?: string
  style?: CSSProperties
  /** Off-screen by default; set for the largest image above the fold. */
  priority?: boolean
}

/** Modern formats with a fallback, explicit dimensions, and lazy loading. */
export const Picture: FC<PictureProps> = ({
  sources,
  alt,
  width,
  height,
  sizes,
  style,
  priority = false,
}) => (
  <picture>
    {sources.avif && (
      <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
    )}
    <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
    <Img
      src={sources.fallback}
      alt={alt}
      width={width}
      height={height}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(priority && { fetchPriority: 'high' as const })}
    />
  </picture>
)
