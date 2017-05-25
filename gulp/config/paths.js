import path from 'path'
const p = (...args) => path.resolve(...args)

const defineDirIn = baseDir => {
  const ALL_FILES = p(baseDir, '**', '*')
  const ALL_JS_FILES = p(baseDir, '**', '*.js')
  const STAT_DIR = p(baseDir, 'stat')
  const ALL_STAT_FILES = p(baseDir, STAT_DIR, '**', '*')

  const SERVER_FILES = [ ALL_FILES, `!${STAT_DIR}` ]

  return {
    ALL_JS_FILES,
    SERVER_FILES,
    ALL_STAT_FILES,
  }
}

export const ROOT_DIR = p(__dirname, '..', '..')
export const BUILD_DIR = p(ROOT_DIR, 'build')
export const SRC_DIR = p(ROOT_DIR, 'src')

export const SRC = defineDirIn(SRC_DIR)

export default {
  ROOT_DIR,
  BUILD_DIR,
  SRC_DIR,
  SRC,
}
