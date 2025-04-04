import { Runner } from '@forgehive/runner'

import { price } from './tasks/stock/price'

const runner = new Runner()

runner.load('get_stock_price', price)

export default runner