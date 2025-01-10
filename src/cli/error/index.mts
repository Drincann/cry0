export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliError';
  }
}

export class CliInternalError extends CliError {
  constructor(message: string) {
    super(message);
    this.name = 'CliInternalError';
  }
}

export class CliParameterError extends CliError {
  constructor(message: string) {
    super(message);
    this.name = 'CliParameterError';
  }
}