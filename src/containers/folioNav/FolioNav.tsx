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
        name: 'Adding Flair',
        path: '/fun',
      },
      {
        name: 'Make it bad',
        path: '/work',
      },
      {
        name: 'Beta',
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