import { Marquee } from '@/components/marquee/Marquee'
import { Box, styled } from '@mui/material'
import { Image, ImageProps } from '@/components/image/Image'

import aws from '@/assets/tech_icons/aws.svg'
import canva from '@/assets/tech_icons/canva.svg'
import confluence from '@/assets/tech_icons/confluence.png'
import copilot from '@/assets/tech_icons/copilot.png'
import css from '@/assets/tech_icons/css.svg'
import cytoscape from '@/assets/tech_icons/cytoscape.svg'
import d3 from '@/assets/tech_icons/d3.png'
import dexie from '@/assets/tech_icons/dexiejs.svg'
import dynamoDb from '@/assets/tech_icons/dynamoDb.png'
import figma from '@/assets/tech_icons/figma.png'
import git from '@/assets/tech_icons/git.png'
import gsap from '@/assets/tech_icons/gsap.svg'
import highcharts from '@/assets/tech_icons/highcharts.png'
import html from '@/assets/tech_icons/html.svg'
import jira from '@/assets/tech_icons/jira.png'
import js from '@/assets/tech_icons/js.svg'
import miro from '@/assets/tech_icons/miro.svg'
import mongoDb from '@/assets/tech_icons/mongoDb.svg'
import mui from '@/assets/tech_icons/mui.png'
import nextjs from '@/assets/tech_icons/nextjs.svg'
import node from '@/assets/tech_icons/node.svg'
import pixijs from '@/assets/tech_icons/pixijs.png'
import postgresql from '@/assets/tech_icons/postgresql.png'
import react_router from '@/assets/tech_icons/react-router.svg'
import wouter from '@/assets/tech_icons/wouter.svg'
import react from '@/assets/tech_icons/react.svg'
import redux from '@/assets/tech_icons/redux.png'
import sass from '@/assets/tech_icons/sass.png'
import socketIO from '@/assets/tech_icons/socketIO.png'
import styledComponents from '@/assets/tech_icons/styled-components.png'
import typescript from '@/assets/tech_icons/typescript.webp'
import vite from '@/assets/tech_icons/vite.svg'
import vscode from '@/assets/tech_icons/vscode.svg'
import webpack from '@/assets/tech_icons/webpack.png'
import webstorm from '@/assets/tech_icons/webstorm.png'
import { FC, ReactElement } from 'react'

const StyledTechMarquees = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
  flex: 1,
  minHeight: '25vh'
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
