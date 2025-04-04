import { Runner } from '@forgehive/runner'

import { price } from './tasks/stock/price'
import { portafolio } from './tasks/stock/portafolio'

const runner = new Runner()

runner.load('get_stock_price', price)
runner.load('get_stock_portafolio', portafolio)

export default runner