import path from 'path'

const p = (...args) => path.resolve(...args)

export const ROOT_DIR = p(__dirname, '../', '../')
export const STAT_DIR = p(ROOT_DIR, 'stat')

export default {
  ROOT_DIR,
  STAT_DIR,
}
