import { Navigation } from "@/components/navigation/Navigation"

const navItems = [
  {
    name: 'Home',
    path: '/home',
    children: [
      {
        name: 'Flair',
        path: '/home/flair',
      },
      {
        name: 'Theme',
        path: '/home/color',
      },
    ],
  },
  {
    name: 'About Me',
    path: '/about',
  },
  {
    name: 'Resume',
    path: '/resume',
  },
  {
    name: 'Stories',
    path: '/storytime',
    children: [
      {
        name: 'Add Some Flair',
        path: '/fun',
      },
      {
        name: 'Make it Bad',
        path: '/work',
      },
      {
        name: 'Beta the Game',
        path: '/beta',
      },
    ],
  },
]

export const FolioNav = () => {
  return (
    <Navigation data={navItems} />
  )
}