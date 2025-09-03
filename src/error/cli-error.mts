export class CliError extends Error {
  constructor(message: string, error?: unknown) {
    super(message, { cause: error instanceof Error ? error : undefined })
  }
}

export class CliInternalError extends CliError {
  constructor(message: string, error?: unknown) {
    super(message, error)
  }
}

export class CliParameterError extends CliError {
  constructor(message: string, error?: unknown) {
    super(message, error)
  }
}