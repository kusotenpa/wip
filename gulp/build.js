import gulp from 'gulp'
import plumber from 'gulp-plumber'
import babel from 'gulp-babel'

import {
  SRC,
  SRC_DIR,
  BUILD_DIR,
} from './config/paths'

gulp.task('build:server', cb => {
  gulp.src(SRC.SERVER_FILES)
    .pipe(gulp.dest(BUILD_DIR))
    .on('end', () => {
      gulp.src(SRC.ALL_JS_FILES)
        .pipe(plumber())
        .pipe(babel())
        .pipe(gulp.dest(BUILD_DIR))
        .on('end', cb)
    })
})

gulp.task('build:stat', () => {
  return gulp.src(SRC.ALL_STAT_FILES, { base: SRC_DIR })
    .pipe(gulp.dest(BUILD_DIR))
})

gulp.task('build', [ 'build:server', 'build:stat' ])
