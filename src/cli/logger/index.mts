export const logger = {
  info: (message: unknown) => {
    console.log(message)
  },

  warn: (message: unknown) => {
    console.warn(message)
  },

  error: (message: unknown) => {
    console.error(message)
  },

  debug: (message: unknown) => {
    if (process.env.DEBUG) {
      console.log(message)
    }
  }
}
