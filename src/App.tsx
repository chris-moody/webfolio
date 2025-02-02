import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import WizardController from './components/wizard/WizardController'
import { useDynamicTheme } from './theme'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './App.css'
import { useAppSelector } from './redux/hooks'
import {
  selectThemeColor,
  selectThemeFlair,
} from './redux/slices/theme/theme.selector'
import { Outlet } from 'react-router'

function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )
}

function Main() {
  const color = useAppSelector(selectThemeColor)
  const flair = useAppSelector(selectThemeFlair)
  const theme = useDynamicTheme(
    { palette: { primary: { main: color } } },
    flair
  )
  return (
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline enableColorScheme />
      <WizardController>
        <Outlet />
      </WizardController>
    </ThemeProvider>
  )
}
export default App
/* 
TODO Error boundary
TODO animated doodads
  TODO FLAIR rainbow text, bouncing letters, that drop confetti. Light on fire?
TODO Flair and pinback interaction
TODO add color mode to setting modal
TODO add content on select, ie: "Me? I know who I am! I'm a dude playing a dude disguised as another dude!"
TODO 3d text cross fade is no good
TODO alt transitions depnding on flair
TODO fix images on small screens
TODO dark/light mode icons
*/
