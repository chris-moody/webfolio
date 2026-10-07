// Optimized media (scripts/optimize-media.sh → src/assets/media/).
import meAvif480 from '@/assets/media/me-at-magens-480.avif'
import meAvif800 from '@/assets/media/me-at-magens-800.avif'
import meAvif1200 from '@/assets/media/me-at-magens-1200.avif'
import meWebp480 from '@/assets/media/me-at-magens-480.webp'
import meWebp800 from '@/assets/media/me-at-magens-800.webp'
import meWebp1200 from '@/assets/media/me-at-magens-1200.webp'
import meJpg1200 from '@/assets/media/me-at-magens-1200.jpg'
import classAvif from '@/assets/media/beta-classroom-600.avif'
import classWebp from '@/assets/media/beta-classroom-600.webp'
import classJpg from '@/assets/media/beta-classroom-600.jpg'
import levelAvif from '@/assets/media/beta-level-design-600.avif'
import levelWebp from '@/assets/media/beta-level-design-600.webp'
import levelJpg from '@/assets/media/beta-level-design-600.jpg'
import laptopWebp from '@/assets/media/beta-laptop-650.webp'
import laptopPng from '@/assets/media/beta-laptop-650.png'
import type { PictureProps } from '@/components/image/Picture'

type Media = Pick<PictureProps, 'sources' | 'width' | 'height' | 'sizes'>

export const meAtMagens: Media = {
  sources: {
    avif: `${meAvif480} 480w, ${meAvif800} 800w, ${meAvif1200} 1200w`,
    webp: `${meWebp480} 480w, ${meWebp800} 800w, ${meWebp1200} 1200w`,
    fallback: meJpg1200,
  },
  width: 1200,
  height: 800,
  // Rendered at most 600 CSS px wide.
  sizes: '(min-width: 640px) 600px, 100vw',
}

export const betaClassroom: Media = {
  sources: { avif: classAvif, webp: classWebp, fallback: classJpg },
  width: 600,
  height: 338,
}
export const betaLevelDesign: Media = {
  sources: { avif: levelAvif, webp: levelWebp, fallback: levelJpg },
  width: 600,
  height: 338,
}
export const betaLaptop: Media = {
  sources: { webp: laptopWebp, fallback: laptopPng },
  width: 650,
  height: 375,
}
