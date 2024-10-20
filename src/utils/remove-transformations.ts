export const removeTransformations = (url: string) => {
  const splitUrl = url.split('//')

  const removeQualityTransformations = splitUrl[1]
    .split('/')
    .map((str) => {
      if (str.startsWith('c_') || str.startsWith('w_') || str.startsWith('f_') || str.startsWith('q_')) {
        return
      }

      return str
    })
    .filter(Boolean)
    .join('/')

  const joinUrl = `${splitUrl[0]}//${removeQualityTransformations}`

  return joinUrl
}
