import { FC, ReactElement } from 'react'
import { preload } from 'react-dom'
import { Box, styled } from '@mui/material'
import { Marquee } from '@/components/marquee/Marquee'
import { Image, ImageProps } from '@/components/image/Image'

const aws = '/tech_icons/aws.svg'
const canva = '/tech_icons/canva.svg'
const confluence = '/tech_icons/confluence.png'
const copilot = '/tech_icons/copilot.png'
const css = '/tech_icons/css.svg'
const cytoscape = '/tech_icons/cytoscape.svg'
const d3 = '/tech_icons/d3.png'
const dexie = '/tech_icons/dexiejs.svg'
const dynamoDb = '/tech_icons/dynamoDb.png'
const figma = '/tech_icons/figma.png'
const git = '/tech_icons/git.png'
const gsap = '/tech_icons/gsap.svg'
const highcharts = '/tech_icons/highcharts.png'
const html = '/tech_icons/html.svg'
const jira = '/tech_icons/jira.png'
const js = '/tech_icons/js.svg'
const miro = '/tech_icons/miro.svg'
const mongoDb = '/tech_icons/mongoDb.svg'
const mui = '/tech_icons/mui.png'
const nextjs = '/tech_icons/nextjs.svg'
const node = '/tech_icons/node.svg'
const pixijs = '/tech_icons/pixijs.png'
const postgresql = '/tech_icons/postgresql.png'
const react_router = '/tech_icons/react-router.svg'
const wouter = '/tech_icons/wouter.svg'
const react = '/tech_icons/react.svg'
const redux = '/tech_icons/redux.png'
const sass = '/tech_icons/sass.png'
const socketIO = '/tech_icons/socketIO.png'
const styledComponents = '/tech_icons/styled-components.png'
const typescript = '/tech_icons/typescript.webp'
const vite = '/tech_icons/vite.svg'
const vscode = '/tech_icons/vscode.svg'
const webpack = '/tech_icons/webpack.png'
const webstorm = '/tech_icons/webstorm.png'
preload(aws, { as: 'image' })
preload(canva, { as: 'image' })
preload(confluence, { as: 'image' })
preload(copilot, { as: 'image' })
preload(css, { as: 'image' })
preload(cytoscape, { as: 'image' })
preload(d3, { as: 'image' })
preload(dexie, { as: 'image' })
preload(dynamoDb, { as: 'image' })
preload(figma, { as: 'image' })
preload(git, { as: 'image' })
preload(gsap, { as: 'image' })
preload(highcharts, { as: 'image' })
preload(html, { as: 'image' })
preload(jira, { as: 'image' })
preload(js, { as: 'image' })
preload(miro, { as: 'image' })
preload(mongoDb, { as: 'image' })
preload(mui, { as: 'image' })
preload(nextjs, { as: 'image' })
preload(node, { as: 'image' })
preload(pixijs, { as: 'image' })
preload(postgresql, { as: 'image' })
preload(react_router, { as: 'image' })
preload(wouter, { as: 'image' })
preload(react, { as: 'image' })
preload(redux, { as: 'image' })
preload(sass, { as: 'image' })
preload(socketIO, { as: 'image' })
preload(styledComponents, { as: 'image' })
preload(typescript, { as: 'image' })
preload(vite, { as: 'image' })
preload(vscode, { as: 'image' })
preload(webpack, { as: 'image' })
preload(webstorm, { as: 'image' })

const StyledTechMarquees = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  flex: 1,
  minHeight: '25vh',
})

const StyledWrapper = styled(Box)({
  position: 'absolute',
  transform: 'translate(-50%, -50%) rotate(45deg)',
  top: '50%',
  left: '50%',
  transformOrigin: '50% 50%',
})

export type MarqueeImageProps = Omit<ImageProps, 'id'> & {
  id: string
}

const createImageArray = (data: MarqueeImageProps[]): ReactElement[] => {
  return data
    .map(({ id, ...props }) => (
      <Image
        className="item"
        {...props}
        alt={id}
        key={id}
        style={{ maxWidth: '100px', paddingRight: '16px' }}
      />
    ))
    .concat(
      data.map(({ id, ...props }) => (
        <Image
          className="item"
          {...props}
          alt={id}
          key={id + 2}
          style={{ maxWidth: '100px', paddingRight: '16px' }}
        />
      ))
    )
}

export const TechMarquees: FC = () => {
  const tools = createImageArray([
    { id: 'Canva', src: canva },
    { id: 'Confluence', src: confluence },
    { id: 'Copilot', src: copilot },
    { id: 'Figma', src: figma },
    { id: 'jira', src: jira },
    { id: 'miro', src: miro },
    { id: 'vscode', src: vscode },
    { id: 'webstorm', src: webstorm },
  ])
  const tech = createImageArray([
    { id: 'Cytoscape', src: cytoscape },
    { id: 'd3', src: d3 },
    { id: 'dexiejs', src: dexie },
    { id: 'react_router', src: react_router },
    { id: 'git', src: git },
    { id: 'gsap', src: gsap },
    { id: 'highcharts', src: highcharts },
    { id: 'mui', src: mui },
    { id: 'pixijs', src: pixijs },
    { id: 'wouter', src: wouter },
    { id: 'react', src: react },
    { id: 'redux', src: redux },
    { id: 'styled_components', src: styledComponents },
    { id: 'nextjs', src: nextjs },
  ])
  const server = createImageArray([
    { id: 'AWS', src: aws },
    { id: 'CSS', src: css },
    { id: 'Dynamo DB', src: dynamoDb },
    { id: 'html', src: html },
    { id: 'js', src: js },
    { id: 'Mongo DB', src: mongoDb },
    { id: 'nodejs', src: node },
    { id: 'postgresql', src: postgresql },
    { id: 'sass', src: sass },
    { id: 'socketIO', src: socketIO },
    { id: 'typescript', src: typescript },
    { id: 'vite', src: vite },
    { id: 'webpack', src: webpack },
  ])
  return (
    <StyledTechMarquees className="content">
      <StyledWrapper>
        <Marquee speed={0.5} overflow="hidden">
          {tools}
        </Marquee>
        <Marquee speed={1} overflow="hidden" reversed>
          {tech}
        </Marquee>
        <Marquee speed={0.25} overflow="hidden">
          {server}
        </Marquee>
      </StyledWrapper>
    </StyledTechMarquees>
  )
}
