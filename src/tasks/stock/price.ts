// TASK: price
// Run this task with:
// forge task:run stock:price --ticker AAPL

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'

const schema = new Schema({
  ticker: Schema.string().describe('Stock ticker symbol (e.g., AAPL, MSFT, GOOG)')
})

const boundaries = {
  fetchJson: async (url: string): Promise<any> => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }
}

export const price = createTask(
  schema,
  boundaries,
  async function ({ ticker }, { fetchJson }) {
    // Yahoo Finance API URL
    const yahooFinanceUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d`
    
    // Fetch data from Yahoo Finance
    const data = await fetchJson(yahooFinanceUrl)
    
    // Extract the current price
    const result = data.chart.result[0]
    const meta = result.meta
    const quote = result.indicators.quote[0]
    const timestamp = result.timestamp[result.timestamp.length - 1]
    const closePrice = quote.close[quote.close.length - 1]
    
    return {
      ticker: meta.symbol,
      price: closePrice,
      currency: meta.currency,
      timestamp: new Date(timestamp * 1000).toISOString(),
      exchange: meta.exchangeName
    }
  }
)
