export default `

  precision mediump float;

  #define TWO_PI 6.28318530718
  #define PI TWO_PI / 2.

  uniform float time;
  uniform float opacity;
  uniform float knob0;
  uniform vec2 resolution;


  float random(float p) {
    return fract(sin(p) * 1e4);
  }

  float random (vec2 p) {
    return fract(sin(dot(p.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 p) {
    return random(p.x + p.y * 10000.);
  }

  vec2 rotate2d(vec2 p, const float angle) {
    p -= .5;
    p *= mat2(
      cos(angle), -sin(angle),
      sin(angle), cos(angle)
    );
    return p += .5;
  }

  float shift (vec2 p, float value) {
    float t = time;
    p.y *= value;
    p.x += step(1., mod(p.y, 2.)) * .8 + floor(p.y) * .2;
    p.x *= fract(sin(floor(p.y)) * t) > .5 ? 1. : -1.;
    return fract(p.x);

    // p.x *= value;
    // p.y += step(1., mod(p.x, 2.)) * .1 + floor(p.x) * .1;
    // p.y *= sin(floor(p.x) * t) > .5 ? 1. : -1.;
    return fract(p.y);
  }

  mat2 scale(const vec2 scale) {
    return mat2(
      scale.x, .0,
      .0, scale.y
    );
  }

  float randomSerie(float x, float freq, float t) {
    return step(.8, random(floor(x * freq) - floor(t)));
  }


  void main() {
    // 左端から0 ~ 1
    vec2 p = gl_FragCoord.xy / min(resolution.x, resolution.y);
    // 中心が0の -1 ~ 1
    // vec2 p = (gl_FragCoord.xy * 2.0 - iResolution) / min(iResolution.x, iResolution.y);
    float t = time;


    // float tileNum = 8.;
    // p = tile(p, tileNum);
    // p = rotate2d(p, t);

    // p = shift(p, tileNum);
    // p *= scale(vec2(500.1));
    // p = rotate2d(p, t);

    float offset = .055;
    float freq = random(floor(t)) + abs(atan(t) * .1);
    float tt = 60. + t * (1. - freq) * 30.;

    freq *= 90.;

    p = vec2(shift(p, 40. * knob0));

    vec3 color = vec3(
      randomSerie(p.x, freq, tt + offset),
      randomSerie(p.x, freq, tt - offset * 2.),
      randomSerie(p.x, freq, tt - offset / 2.)
    );

    gl_FragColor = vec4(color, opacity);
  }
`
