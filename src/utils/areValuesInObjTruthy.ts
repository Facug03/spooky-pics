export const areValuesInObjTruthy = (obj: Record<string, unknown>) =>
  Object.values(obj).filter(Boolean).length > 0
