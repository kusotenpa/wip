export default `

  precision mediump float;

  #define TWO_PI 6.28318530718
  #define PI TWO_PI / 2.

  uniform float time;
  uniform float opacity;
  uniform float knob0;
  uniform vec2 resolution;

  vec2 rotate2d(vec2 position, const float angle) {
    position -= .5;
    position *= mat2(
      cos(angle), -sin(angle),
      sin(angle), cos(angle)
    );
    return position += .5;
  }

  float random(float p) {
    return fract(sin(p) * 1e4);
  }

  vec2 random2(vec2 value) {
    return fract(sin(vec2(dot(value, vec2(127.1, 311.7)), dot(value, vec2(269.5, 183.3)))) * 43758.5453);
  }


  void main() {
    vec2 position = gl_FragCoord.xy / min(resolution.x, resolution.y);
    // position = rotate2d(position, time * knob0);
    position *= 10.;

    vec2 iPosition = floor(position);
    vec2 fPosition = fract(position);
    vec3 color = vec3(0.);
    vec2 minPoint = vec2(0.);
    float minDist = 1.;

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = random2(iPosition + neighbor);
        point = sin(time * point * 5.) * .3 + .7;
        vec2 diff = neighbor + point - fPosition;
        float dist = length(diff);
        if (minDist > dist) {
          minDist = sin(random(time) * .1) + dist;
          minPoint = point;
        }
      }
    }

    color += minDist;
    color += minPoint.x * (.6 * sin(minPoint.x * 50. * knob0)) * vec3(1.);

    gl_FragColor = vec4(color, opacity);
  }
`
