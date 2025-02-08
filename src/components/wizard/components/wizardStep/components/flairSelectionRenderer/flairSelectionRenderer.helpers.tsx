import { preload } from 'react-dom'
import { Node } from './components/circlePacking.types'

const balance = '/pins/balance.png'
const batman = '/pins/batman.png'
const xmen = '/pins/xmen.png'
const jake = '/pins/jake.png'
const nocryinginbaseball = '/pins/nocryinginbaseball.png'
const rollsafe = '/pins/rollsafe.png'
const palmtree = '/pins/palmtree.png'
const mario = '/pins/mario.png'
const xenomorph = '/pins/xenomorph.png'
const stewie = '/pins/stewie.png'
const butterbot = '/pins/butterbot.png'
const ssf2t = '/pins/ssf2t.png'
const resistanceisfutile = '/pins/resistanceisfutile.png'
const inigo = '/pins/inigo.png'
const greenranger = '/pins/greenranger.png'
const breakingbad = '/pins/breakingbad.png'
const ecko = '/pins/ecko.png'
const scouts = '/pins/scouts.png'
const luffy = '/pins/luffy.png'
const radioshack = '/pins/radioshack.png'
const thumbsup = '/pins/thumbsup.png'
const uchiha = '/pins/uchiha.png'
const nightblood = '/pins/nightblood.png'
const highground = '/pins/highground.png'
const imdoingmypart = '/pins/imdoingmypart.png'
const lukevsvader = '/pins/lukevsvader.png'
const triforce = '/pins/triforce.png'
const blockbuster = '/pins/blockbuster.png'
const hyperion = '/pins/hyperion.png'
const vegeta = '/pins/vegeta.png'
const protoman = '/pins/protoman.png'
const rebel = '/pins/rebel.png'
const predator = '/pins/predator.png'
const hanshotfirst = '/pins/hanshotfirst.png'
const spidey = '/pins/spidey.png'
const stevenuniverse = '/pins/stevenuniverse.png'
const kansas = '/pins/kansas.png'
preload(balance, { as: 'image' })
preload(batman, { as: 'image' })
preload(xmen, { as: 'image' })
preload(jake, { as: 'image' })
preload(nocryinginbaseball, { as: 'image' })
preload(rollsafe, { as: 'image' })
preload(palmtree, { as: 'image' })
preload(mario, { as: 'image' })
preload(xenomorph, { as: 'image' })
preload(stewie, { as: 'image' })
preload(butterbot, { as: 'image' })
preload(ssf2t, { as: 'image' })
preload(resistanceisfutile, { as: 'image' })
preload(inigo, { as: 'image' })
preload(greenranger, { as: 'image' })
preload(breakingbad, { as: 'image' })
preload(ecko, { as: 'image' })
preload(scouts, { as: 'image' })
preload(luffy, { as: 'image' })
preload(radioshack, { as: 'image' })
preload(thumbsup, { as: 'image' })
preload(uchiha, { as: 'image' })
preload(nightblood, { as: 'image' })
preload(highground, { as: 'image' })
preload(imdoingmypart, { as: 'image' })
preload(lukevsvader, { as: 'image' })
preload(triforce, { as: 'image' })
preload(blockbuster, { as: 'image' })
preload(hyperion, { as: 'image' })
preload(vegeta, { as: 'image' })
preload(protoman, { as: 'image' })
preload(rebel, { as: 'image' })
preload(predator, { as: 'image' })
preload(hanshotfirst, { as: 'image' })
preload(spidey, { as: 'image' })
preload(stevenuniverse, { as: 'image' })
preload(kansas, { as: 'image' })

export type PinData = Node & {
  background?: string
  index: number
}

export const getPinData = (): PinData[] => [
  { name: 'kansas', group: 'one', background: kansas },
  { name: 'spidey', group: 'one', background: spidey },
  { name: 'hanshotfirst', group: 'one', background: hanshotfirst },
  { name: 'predator', group: 'one', background: predator },
  { name: 'rebel', group: 'one', background: rebel },
  { name: 'protoman', group: 'one', background: protoman },
  { name: 'vegeta', group: 'one', background: vegeta },
  { name: 'hyperion', group: 'one', background: hyperion },
  { name: 'blockbuster', group: 'one', background: blockbuster },
  { name: 'triforce', group: 'one', background: triforce },
  { name: 'lukevsvader', group: 'one', background: lukevsvader },
  { name: 'imdoingmypart', group: 'one', background: imdoingmypart },
  { name: 'stevenuniverse', group: 'one', background: stevenuniverse },
  { name: 'highground', group: 'one', background: highground },
  { name: 'nightblood', group: 'one', background: nightblood },
  { name: 'uchiha', group: 'one', background: uchiha },
  { name: 'thumbsup', group: 'one', background: thumbsup },
  { name: 'radioshack', group: 'one', background: radioshack },
  { name: 'strawhatluffy', group: 'one', background: luffy },
  { name: 'scouts', group: 'one', background: scouts },
  { name: 'ecko', group: 'one', background: ecko },
  { name: 'breakingbad', group: 'one', background: breakingbad },
  { name: 'greenranger', group: 'one', background: greenranger },
  { name: 'inigomontoya', group: 'one', background: inigo },
  { name: 'resistanceisfutile', group: 'one', background: resistanceisfutile },
  { name: 'superstreetfighter', group: 'one', background: ssf2t },
  { name: 'butterbot', group: 'one', background: butterbot },
  { name: 'stewie', group: 'one', background: stewie },
  { name: 'xenomorph', group: 'one', background: xenomorph },
  { name: 'mariobros3', group: 'one', background: mario },
  { name: 'palmtree', group: 'one', background: palmtree },
  { name: 'rollsafe', group: 'one', background: rollsafe },
  { name: 'nocryinginbaseball', group: 'one', background: nocryinginbaseball },
  { name: 'jakethedog', group: 'one', background: jake },
  { name: 'mutant', group: 'one', background: xmen },
  { name: 'batman', group: 'one', background: batman },
  { name: 'balance', group: 'one', background: balance },
].map((p, index) => ({ ...p, index, value: p.name.length * 7.5 }))