import {
  Box,
  IconButton,
  Link,
  styled,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { FC } from 'react'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { FancyText } from '@/components/fancyText/FancyText'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import CallIcon from '@mui/icons-material/Call';

export const StyledResume = styled(Box)(({ theme }) => [
  {
    overflow: 'auto',
    background: 'rgba(255, 255, 255, 0.75)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    '.section': {
      marginBottom: theme.spacing(2),
      ul: {
        paddingLeft: theme.spacing(2),
      },
    },
    '.skills': {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: 0,
      li: {
        listStyle: 'none',
        '>span': {
          display: 'block',
          '&:first-of-type': {
            fontWeight: 'bold',
          },
          '&:not(:first-of-type)': {
            paddingLeft: theme.spacing(1),
            marginBottom: theme.spacing(1),
          },
        },
      },
      [theme.breakpoints.up('md')]: {
        display: 'table',
        li: {
          display: 'table-row',
          span: {
            display: 'table-cell',
            '&:first-of-type': {
              paddingRight: theme.spacing(2),
            },
          },
        },
      },
    },
    '.MuiTypography-root': {
      textAlign: 'left',
      '&.info': {
        textAlign: 'center',
      },
      '&.MuiTypography-h3, &.MuiTypography-h4': {
        fontWeight: 'bold',
      },
    },
    '.roles': {
      textDecoration: 'underline',
      fontStyle: 'italic',
    },
  },
  theme.applyStyles('dark', {
    background: 'rgba(0, 0, 0, 0.45)',
  }),
])

export const ResumeRenderer: FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <>
      <Toolbar
        sx={[
          {
            position: 'sticky',
            background: 'rgba(255,255,255,.75)',
            my: 1,
            py: 1,
            borderRadius: theme.spacing(1),
            minHeight: 'unset !important',
            justifyContent: 'space-between',
          },
          theme.applyStyles('dark', {
            background: 'rgba(0, 0, 0, 0.45)',
          }),
        ]}
      >
        <Typography variant="body1" className="info">
          <Link title="Call Me" href="tel:+19172257503" mr={{ xs: 2, md: 0 }}>{isMobile ? <IconButton><CallIcon /></IconButton> : "917.225.7503"}</Link>
          {!isMobile && <Typography mx={2} component="span">
            &bull;
          </Typography>}
          <Link title="Email Me" target="_blank" href="mailto:chris@moodydigital.com">
            {isMobile ? <IconButton><AlternateEmailIcon /></IconButton> : "chris@moodydigital.com"}
          </Link>
          {!isMobile && (
            <>
              <Typography mx={2} component="span">
                &bull;
              </Typography>
              Cary, NC 27519
            </>
          )}
        </Typography>
        <IconButton
          href="/cmoodyResume.pdf"
          download
          title="Take it with you, I don't mind!"
        >
          <FileDownloadIcon />
        </IconButton>
      </Toolbar>

      <StyledResume>
        <Box className="section">
          <FancyText variant="h3">INTRODUCTION</FancyText>
          <Typography variant="body1">
            Chris is a software engineer with over 20 years of experience and a
            passion for interactive development. He excels at building modular
            components, web applications and data visualizations. Possessing a
            diverse skill set, he is able to fulfill the roles of tech lead,
            manager, individual contributor, and mentor. Chris enjoys a good
            challenge, and seeks opportunities that allow him to push limits,
            set trends, and break molds
          </Typography>
        </Box>

        <Box className="section">
          <FancyText variant="h3">EDUCATION</FancyText>
          <Typography variant="h4">
            CARNEGIE MELLON UNIVERSITY, Pittsburgh, PA
          </Typography>
          <Typography variant="body1">
            <em>
              Bachelor of Science, Electrical and Computer Engineering, December
              2007
            </em>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h3">SKILLS &amp; PROFIENCIES</Typography>
          <Typography variant="body1" className="skills" component="ul">
            <Typography variant="body1" component="li">
              <Typography variant="body1" component="span">
                Technologies
              </Typography>
              <Typography variant="body1" component="span">
                JavaScript, Typescript, SSR, sass, PostgreSQL, AWS Lambda,
                DynamoDB, indexedDB, C#, ES5, AS3
              </Typography>
            </Typography>

            <Typography variant="body1" component="li">
              <Typography variant="body1" component="span">
                Frameworks & Libs
              </Typography>
              <Typography variant="body1" component="span">
                React, redux, Next.js, MUI, node, d3, AG Grid, three.js, p5,
                Vue, Dexie, pixi, jest, jQuery
              </Typography>
            </Typography>

            <Typography variant="body1" component="li">
              <Typography variant="body1" component="span">
                Tools
              </Typography>
              <Typography variant="body1" component="span">
                VSCode, copilot, git, webpack, Vite, Miro, Jira, Confluence,
                Figma, XD, Canva, Photoshop
              </Typography>
            </Typography>

            <Typography variant="body1" component="li">
              <Typography variant="body1" component="span">
                Deliverables
              </Typography>
              <Typography variant="body1" component="span">
                Websites, MicroFrontends, apps, presentations, convention
                panels, games, ads, banners
              </Typography>
            </Typography>
          </Typography>
        </Box>

        <FancyText variant="h3">PROFESSIONAL EXPERIENCE</FancyText>
        <Box className="section">
          <Typography variant="h4">
            Moody&rsquo;s Corporation, New York, NY
          </Typography>
          <Typography variant="body1" className="roles">
            Staff Software Engineer, 05/2021-Present; Remote off-site
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Develop full stack features involving database queries, serverless functions and data visualization
            </Typography>
            <Typography variant="body1" component="li">
              Increase customer engagement with the new moodys.com homepage launch
            </Typography>
            <Typography variant="body1" component="li">
            Launch new Company Pages product and support coverage expansion initiatives to include unrated and sovereign entities
            </Typography>
            <Typography variant="body1" component="li">
            Work with team members and participate in cross-product team efforts to create services and widgets
            </Typography>
            <Typography variant="body1" component="li">
            Optimize project integration of our in-house shared component nanofrontend 
            </Typography>
            <Typography variant="body1" component="li">
            Foster an open and collaborative environment by encouraging curiosity around the unknown, and discussion around challenges
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">
            NeON, an FCB Health Company, New York, NY
          </Typography>
          <Typography variant="body1" className="roles">
            Freelance Senior Developer, 11/2013-05/2021, Remote off-site
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Develop responsive websites using various technologies such as
              Angular, React, Next.js, handlebars, pug
            </Typography>
            <Typography variant="body1" component="li">
              Develop web and flash content for tablet-based CRM tools, games,
              banner advertisements and panels
            </Typography>
            <Typography variant="body1" component="li">
              Develop NodeJS/Electron-based desktop servers for multi-screen,
              networked application rollouts
            </Typography>
            <Typography variant="body1" component="li">
              Create data visualizations with d3. Tabulate data with AG Grid
            </Typography>
            <Typography variant="body1" component="li">
              Attend conferences and events to provide on-site support and live
              updates when necessary
            </Typography>
            <Typography variant="body1" component="li">
              Coach/Mentor team members on patterns, best practices and style
            </Typography>
            <Typography variant="body1" component="li">
              Ensure that creative concepts stay within operable technical
              specs. Advise creative on user interface and experience
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">
            Hidden Level Games LLC, New York, NY
          </Typography>
          <Typography variant="body1" className="roles">
            Co-founder and Engineer, 10/2011-12/2017
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Develop an interactive programming game (Beta) for Desktop Windows
              and Mac OS in AS3 and Adobe AIR
            </Typography>
            <Typography variant="body1" component="li">
              Create a scripting language (CodePop) that allows users to modify
              world and object properties
            </Typography>
            <Typography variant="body1" component="li">
              Develop a Python web server that allows users to save and share
              their creations
            </Typography>
            <Typography variant="body1" component="li">
              Program engaging gameplay mechanics; grappling hook, collect
              items, projectiles
            </Typography>
            <Typography variant="body1" component="li">
              Expand CodePop with conditional and loop statements and an event
              system
            </Typography>
            <Typography variant="body1" component="li">
              Create a prototype web socket server for real-time multiplayer and
              collaboration
            </Typography>
            <Typography variant="body1" component="li">
              Partner with the Anita Borg foundation and similar organizations
              to host Beta coding camps
            </Typography>
            <Typography variant="body1" component="li">
              Work with educators to create classroom curricula and content
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">Harrison and Star, New York, NY</Typography>
          <Typography variant="body1" className="roles">
            Freelance Senior Interactive Developer, 11/2011-12/2013, Remote
            off-site
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Develop HTML/CSS3/JavaScript content for iPad-based marketing
              tools
            </Typography>
            <Typography variant="body1" component="li">
              Develop and optimize AIR applications targeting touchscreen
              desktop and iOS platforms
            </Typography>
            <Typography variant="body1" component="li">
              Interface with hardware via bluetooth, usb, and serial port i/O
              streams
            </Typography>
            <Typography variant="body1" component="li">
              Build a suite of applications that enable iPads to control video
              content across networked devices using web sockets
            </Typography>
            <Typography variant="body1" component="li">
              Create particle effects and three dimensional experiences with
              WebGL
            </Typography>
            <Typography variant="body1" component="li">
              Architect a SQLite database manager for tracking, storing and
              distributing application metrics
            </Typography>
            <Typography variant="body1" component="li">
              Contribute technical expertise to the creative process, vetting
              ideas against specifications and timelines
            </Typography>
            <Typography variant="body1" component="li">
              Develop HTML/JavaScript websites with backwards-compatibility all
              the way down to IE7
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">Tremor Video, New York, NY</Typography>
          <Typography variant="body1" className="roles">
            Freelance Senior Developer, 08/2011-11/2011
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Develop and optimize video and rich media banner advertisements
            </Typography>
            <Typography variant="body1" component="li">
              Guide and mentor junior developers on best practices and style
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">
            NeON, an FCB Health Company, New York, NY
          </Typography>
          <Typography variant="body1" className="roles">
            Freelance Senior Developer, 06/2010-04/2011
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Architect a content development framework for direct sales
              solution platforms. Target web, DVD/CD, Exploria, and Skura
            </Typography>
            <Typography variant="body1" component="li">
              Write and generate documentation with ASDoc
            </Typography>
            <Typography variant="body1" component="li">
              Mentor and train developers on process, best practices and
              framework
            </Typography>
            <Typography variant="body1" component="li">
              Distribute tasks to team members based on skill level. Interview
              and evaluate new candidates
            </Typography>
            <Typography variant="body1" component="li">
              Develop and optimize banners, microsites and rich media apps for
              Pfizer, Boehringer-Ingelheim, and others
            </Typography>
            <Typography variant="body1" component="li">
              Provide technical guidance to the creative team. Ensure that
              concepts stay within operable technical specs
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">Visual Alchemy, New York, NY</Typography>
          <Typography variant="body1" className="roles">
            Freelance Front-End Developer, 04/2010-06/2010
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Build a variety of modular flash applications for web, desktop and
              DVD release
            </Typography>
            <Typography variant="body1" component="li">
              Stream online video via Flash Media Server, and package offline
              apps with both Zinc and AIR
            </Typography>
            <Typography variant="body1" component="li">
              Build HTML/CSS/JavaScript websites from Photoshop comps
            </Typography>
            <Typography variant="body1" component="li">
              Assist creative team during brainstorming, pitch & design phases.
              Ensure that concepts stay within operable technical specs
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">FCB Health, New York, NY</Typography>
          <Typography variant="body1" className="roles">
            Freelance Senior Developer, 02/2010-04/2010
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Build and animate interactive widgets and charts
            </Typography>
            <Typography variant="body1" component="li">
              Mentor and train developers on process and framework
            </Typography>
            <Typography variant="body1" component="li">
              Distribute tasks to team members. Interview and evaluate new
              candidates
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">LLNS, New York, NY</Typography>
          <Typography variant="body1" className="roles">
            Lead Developer, 08/2009-01/2010
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Architect a scalable content development framework for direct
              sales solution platforms
            </Typography>
            <Typography variant="body1" component="li">
              Distribute tasks to team members based on skill level. Interview
              and evaluate new candidates
            </Typography>
            <Typography variant="body1" component="li">
              Set the tone for development by introducing key Object-Oriented
              programming practices
            </Typography>
            <Typography variant="body1" component="li">
              Work with design, account teams, and tech directors to keep
              projects on track and within spec
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">Erkel Associates, Crozet, VA</Typography>
          <Typography variant="body1" className="roles">
            Independent Consultant, 02/2009-08/2009, Remote off-site
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Develop various interactive kiosk applications leveraging
              Actionscript 3 and Intuit touchscreen framework
            </Typography>
            <Typography variant="body1" component="li">
              Allow several customization options via an XML-based content
              management system
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">IBM, Research Triangle Park, NC</Typography>
          <Typography variant="body1" className="roles">
            Engineer/Scientist, 01/2008-03/2009
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Write Actionscript 3 test applications used to determine the
              stability of hardware components
            </Typography>
            <Typography variant="body1" component="li">
              Identify, track, and solve defects blocking critical test cycles
            </Typography>
          </Typography>
        </Box>

        <Box className="section">
          <Typography variant="h4">IBM, Research Triangle Park, NC</Typography>
          <Typography variant="body1" className="roles">
            Pre-Professional Co-op Engineer, May-August(annually 2004-2007)
          </Typography>
          <Typography variant="body1" component="ul">
            <Typography variant="body1" component="li">
              Completed four consecutive summer internships
            </Typography>
            <Typography variant="body1" component="li">
              Develop practical test tools and applications using Flash and
              Actionscript 2/3
            </Typography>
            <Typography variant="body1" component="li">
              Perform various tasks in the areas of schematic design, signal
              integrity, component testing, and networking
            </Typography>
          </Typography>
        </Box>
      </StyledResume>
    </>
  )
}
