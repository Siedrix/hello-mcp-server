// TASK: portafolio
// Run this task with:
// forge task:run stock:portafolio

import { createTask } from '@forgehive/task'
import { Schema } from '@forgehive/schema'

const schema = new Schema({
  // Add your schema definitions here
  // example: myParam: Schema.string()
})

const boundaries = {
  // Add your boundary functions here
  // example: readFile: async (path: string) => fs.readFile(path, 'utf-8')
}

export const portafolio = createTask(
  schema,
  boundaries,
  async function (argv, boundaries) {
    return { 
      status: 'Ok',
      stocks: {
        AAPL: {amount: 5},
        GOOG: {amount: 10},
        MSFT: {amount: 3}
      }
    }
  }
)

portafolio.setDescription('Get the current stock portfolio')