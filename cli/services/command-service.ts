import { createService, token } from "../../core/mod.ts";

export interface CommandService {
  showHelp: () => void
}

export const commandService = createService<CommandService>(dsl => 
  dsl.token(token('CommandService'))
    .provide(() => ({
      showHelp: () => {
        console.log('Hello, Tappin!')
      }
    }))
)