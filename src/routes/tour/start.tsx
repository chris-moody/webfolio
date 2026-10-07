import { redirect } from 'react-router'
import { tourPath, TOUR_START } from '@/data/tour.manifest'

// /tour has no page of its own. Direct hits are redirected by Netlify
// (_redirects); this covers in-app navigation.
export const clientLoader = () =>
  redirect(tourPath(TOUR_START.wizard, TOUR_START.step))

export function HydrateFallback() {
  return null
}

export default function TourStart() {
  return null
}
