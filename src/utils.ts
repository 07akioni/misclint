export function formatMessage(scope: string, message: string) {
  return `[misclint/${scope}]: ${message}`
}

export function formatInternalErrorMessage(scope: string, message: string) {
  return `[misclint/${scope}]: internal error, ${message}`
}

export function defer() {
  let _resolve: () => void
  let _reject: (error: Error) => void
  const promise = new Promise<void>((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  return {
    promise,
    resolve: _resolve!,
    reject: _reject!
  }
}
