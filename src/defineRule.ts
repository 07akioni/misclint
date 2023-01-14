export type Run<T> = (files: string[], dirs: string[], params: T) => void

export function defineRule<T>(run: Run<T>): Run<T> {
  return run
}
