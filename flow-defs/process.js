declare var process: {
  send(args: any): void,
  on(event: string, args: any): void,
  nextTick(callback: Function): void,
  title: string,
  env: Object,
}
