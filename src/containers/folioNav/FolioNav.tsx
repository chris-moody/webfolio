import { findTourWizard, tourPath } from '@/data/tour.manifest'
import { Navigation } from '@/components/navigation/Navigation'

// Built from the tour manifest, so the menu can't drift from the routes.
const step = (id: string) => {
  const wizard = findTourWizard(id)
  return tourPath(id, wizard?.steps[0])
}

const navItems = [
  {
    name: 'Home',
    path: step('home'),
    children: [
      { name: 'Flair', path: tourPath('home', 'flair') },
      { name: 'Theme', path: tourPath('home', 'color') },
    ],
  },
  { name: 'About Me', path: step('about') },
  { name: 'Resume', path: step('resume') },
  {
    name: 'Stories',
    path: step('storytime'),
    children: [
      { name: 'Add Some Flair', path: step('fun') },
      { name: 'Make it Bad', path: step('work') },
      { name: 'Beta the Game', path: step('beta') },
    ],
  },
  { name: 'Leave the tour', path: '/' },
]

export const FolioNav = () => {
  return <Navigation data={navItems} />
}
