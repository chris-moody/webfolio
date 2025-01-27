import balance from '@/assets/pins/balance.png'
import batman from '@/assets/pins/batman.png'
import xmen from '@/assets/pins/xmen.png'
import jake from '@/assets/pins/jake.png'
import nocryinginbaseball from '@/assets/pins/nocryinginbaseball.png'
import rollsafe from '@/assets/pins/rollsafe.png'
import palmtree from '@/assets/pins/palmtree.png'
import mario from '@/assets/pins/mario.png'
import xenomorph from '@/assets/pins/xenomorph.png'
import vote from '@/assets/pins/vote.png'
import butterbot from '@/assets/pins/butterbot.png'
import ssf2t from '@/assets/pins/ssf2t.png'
import resistanceisfutile from '@/assets/pins/resistanceisfutile.png'
import inigo from '@/assets/pins/inigo.png'
import greenranger from '@/assets/pins/greenranger.png'
import breakingbad from '@/assets/pins/breakingbad.png'
import ecko from '@/assets/pins/ecko.png'
import scouts from '@/assets/pins/scouts.png'
import luffy from '@/assets/pins/luffy.png'
import radioshack from '@/assets/pins/radioshack.png'
import thumbsup from '@/assets/pins/thumbsup.png'
import uchiha from '@/assets/pins/uchiha.png'
import kingofthehill from '@/assets/pins/kingofthehill.png'
import highground from '@/assets/pins/highground.png'
import imdoingmypart from '@/assets/pins/imdoingmypart.png'
import lukevsvader from '@/assets/pins/lukevsvader.png'
import triforce from '@/assets/pins/triforce.png'
import blockbuster from '@/assets/pins/blockbuster.png'
import byefelisha from '@/assets/pins/byefelisha.png'
import gonewiththewind from '@/assets/pins/gonewiththewind.png'
import protoman from '@/assets/pins/protoman.png'
import rebel from '@/assets/pins/rebel.png'
import wutang from '@/assets/pins/wutang.png'
import hanshotfirst from '@/assets/pins/hanshotfirst.png'
import garfield from '@/assets/pins/garfield.png'
import stevenuniverse from '@/assets/pins/stevenuniverse.png'
import kansas from '@/assets/pins/kansas.png'
import { Node } from './components/circlePacking.types'

export type PinData = Node & {
  background?: string
  index: number
}

export const getPinData = (): PinData[] => [
  { name: 'kansas', group: 'one', background: kansas },
  { name: 'garfield', group: 'one', background: garfield },
  { name: 'hanshotfirst', group: 'one', background: hanshotfirst },
  { name: 'wutang', group: 'one', background: wutang },
  { name: 'rebel', group: 'one', background: rebel },
  { name: 'protoman', group: 'one', background: protoman },
  { name: 'gonewiththewind', group: 'one', background: gonewiththewind },
  { name: 'byefelisha', group: 'one', background: byefelisha },
  { name: 'blockbuster', group: 'one', background: blockbuster },
  { name: 'triforce', group: 'one', background: triforce },
  { name: 'lukevsvader', group: 'one', background: lukevsvader },
  { name: 'imdoingmypart', group: 'one', background: imdoingmypart },
  { name: 'stevenuniverse', group: 'one', background: stevenuniverse },
  { name: 'highground', group: 'one', background: highground },
  { name: 'kingofthehill', group: 'one', background: kingofthehill },
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
  { name: 'democracy', group: 'one', background: vote },
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