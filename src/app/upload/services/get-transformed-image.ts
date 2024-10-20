export const getTransformedImage = async ({
  url,
  maxRetries,
  signal
}: {
  url: string
  maxRetries: number
  signal: AbortSignal
}): Promise<[null, boolean] | [Error, null]> => {
  let retryCount = maxRetries

  while (retryCount > 0) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        signal
      })

      if (res.status === 423) {
        sleep(5000)
        retryCount--
        continue
      }

      if (!res.ok) {
        throw new Error('Failed to get transformed image')
      }

      return [null, true]
    } catch (error) {
      if (error instanceof Error) {
        return [error, null]
      }

      return [new Error('Failed to get transformed image'), null]
    }
  }

  return [new Error('Failed to get transformed image'), null]
}

export const sleep = (ms: number) => {
  const start = new Date().getTime()
  let end = start
  while (end < start + ms) {
    end = new Date().getTime()
  }
}
