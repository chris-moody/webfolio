import { FC, HTMLAttributes, ReactNode, useState } from 'react'
import { Box, styled, Tooltip, Typography } from '@mui/material'
import { Marquee } from '@/components/marquee/Marquee'
import { useReducedMotion } from '@/motion/motion'
import { libraries, platform, type Tech, tools } from '@/data/tech'

const LOGO = 84
const GAP = 16

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

const StaticGrid = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(2),
  overflowY: 'auto',
  img: { width: 56, height: 56 },
}))

// Fixed, inline-styled box: the marquee measures each item's computed width
// once, when it starts. Unsized or not-yet-styled items measured 0, and the
// loop never moved.
const item = {
  display: 'flex',
  flex: 'none',
  boxSizing: 'border-box',
  width: LOGO + GAP,
  paddingRight: GAP,
} as const

const Logo = styled('img')({
  width: LOGO,
  height: LOGO,
  objectFit: 'contain',
  display: 'block',
})

const srOnly = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const

type TechTooltipProps = { tech: Tech; children: ReactNode } & Pick<
  HTMLAttributes<HTMLSpanElement>,
  'className' | 'style'
>

/**
 * Name and description on hover or tap. A tap also opens it on click: MUI's
 * touch delay is a timer that a quick tap's touchend cancels. Touch tooltips
 * close themselves after MUI's leaveTouchDelay.
 */
const TechTooltip: FC<TechTooltipProps> = ({ tech, children, ...props }) => {
  const [open, setOpen] = useState(false)
  return (
    <Tooltip
      arrow
      placement="top"
      enterTouchDelay={0}
      describeChild
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      title={
        <>
          <Typography variant="subtitle2" component="span" display="block">
            {tech.name}
          </Typography>
          <Typography variant="caption" component="span" display="block">
            {tech.description}
          </Typography>
        </>
      }
    >
      <span {...props} onClick={() => setOpen(true)}>
        {children}
      </span>
    </Tooltip>
  )
}

const items = (data: Tech[], copy: number) =>
  data.map((tech) => (
    <TechTooltip
      key={`${tech.name}-${copy}`}
      tech={tech}
      className="item"
      style={item}
    >
      <Logo src={tech.src} alt="" width={LOGO} height={LOGO} decoding="async" />
    </TechTooltip>
  ))

/** Enough copies of a row to cover the rotated wall. */
const row = (data: Tech[]) => [...items(data, 0), ...items(data, 1)]

export const TechMarquees: FC = () => {
  const reduced = useReducedMotion()
  const all = [...tools, ...libraries, ...platform]

  // The logos are decorative and repeated; assistive tech gets one list.
  const list = (
    <Box component="ul" sx={srOnly} aria-label="Tools and technologies">
      {all.map((tech) => (
        <li key={tech.name}>
          {tech.name}: {tech.description}
        </li>
      ))}
    </Box>
  )

  // Three endless marquees can't be paused individually, so reduced motion
  // (also the tour's "Stop animations" control) shows the same logos as a grid.
  if (reduced) {
    return (
      <StyledTechMarquees className="content">
        {list}
        <StaticGrid aria-hidden="true">
          {all.map((tech) => (
            <TechTooltip
              key={tech.name}
              tech={tech}
              style={{ display: 'flex' }}
            >
              <img src={tech.src} alt="" width={56} height={56} />
            </TechTooltip>
          ))}
        </StaticGrid>
      </StyledTechMarquees>
    )
  }

  return (
    <StyledTechMarquees className="content">
      {list}
      <StyledWrapper aria-hidden="true">
        <Marquee speed={0.5} overflow="hidden" pauseOnHover>
          {row(tools)}
        </Marquee>
        <Marquee speed={1} overflow="hidden" reversed pauseOnHover>
          {row(libraries)}
        </Marquee>
        <Marquee speed={0.25} overflow="hidden" pauseOnHover>
          {row(platform)}
        </Marquee>
      </StyledWrapper>
    </StyledTechMarquees>
  )
}
