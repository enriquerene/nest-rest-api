export function isDevEnv(): boolean {
  return process.env.ENV !== 'prod';
}
