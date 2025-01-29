import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import WizardController from './components/wizard/WizardController'
import { useDynamicTheme } from './theme'
import wizards from './data/wizards'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './App.css'
import { useAppSelector } from './redux/hooks'
import { selectThemeColor, selectThemeFlair } from './redux/slices/theme/theme.selector'

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
  const theme = useDynamicTheme({ palette: { primary: { main: color } } }, flair)
  return (
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline enableColorScheme />
      <WizardController defaultWizard="settings" wizards={wizards} />
    </ThemeProvider>
  )
}
export default App
/* 

TODO NAV,
TODO deep linking, create component wrapper to handle timing with animation and mount/unmount
TODO pictures and media Youtube beta pics and trailer
TODO animated doodads
TODO Flair and pinback interaction
TODO add color mode to setting modal
TODO add content on select, ie: "Me? I know who I am! I'm a dude playing a dude disguised as another dude!"
TODO 3d text cross fade is no good
TODO alt transitions
*/