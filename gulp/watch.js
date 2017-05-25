import { spawn } from 'child_process'
import gulp from 'gulp'
import watch from 'gulp-watch'

import {
  SRC,
} from './config/paths'

gulp.task('watch:server', () => {
  return watch(SRC.ALL_JS_FILES, () => {
    gulp.start('build:server')
  })
})

gulp.task('watch:client', cb => {
  const webpackWatch = spawn('webpack', [ '--watch', '--color', '--config', 'webpack/index.js' ])

  webpackWatch.stdout.on('data', data => {
    console.log(`stdout: ${data}`)
  })

  webpackWatch.stderr.on('data', data => {
    console.log(`stderr: ${data}`)
  })

  webpackWatch.on('close', code => {
    console.log(`child process exited with code ${code}`)
  })

  cb()
})

gulp.task('watch', [ 'watch:server', 'watch:client' ])
