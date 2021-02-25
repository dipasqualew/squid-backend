

export class Logger {

  public log: (...unknown: unknown[]) => void;

  constructor(quiet = false) {
    this.log = quiet ? () => {} : console.log;
  }
}
