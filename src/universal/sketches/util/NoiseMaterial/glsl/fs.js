import noise from '../../../lib/glsl/noise'

export default `

  precision mediump float;

  uniform float rx;
  uniform float ry;
  uniform float rz;
  uniform float gx;
  uniform float gy;
  uniform float gz;
  uniform float bx;
  uniform float by;
  uniform float bz;
  uniform float time;
  uniform float opacity;
  uniform float brightness;
  uniform bool isNegative;
  uniform bool isHalf;

  varying vec2 vUv;

  ${noise}

  void main() {
    float r = (snoise(vec3(rx * vUv.x, ry * vUv.y, rz * time)));
    float g = (snoise(vec3(gx * vUv.x, gy * vUv.y, gz * time)));
    float b = (snoise(vec3(bx * vUv.x, by * vUv.y, bz * time)));

    isHalf
      ? (
        r = r,
        g = g,
        b = b
      )
      : (
        r = (r + 1.0) / 2.0,
        g = (g + 1.0) / 2.0,
        b = (b + 1.0) / 2.0
      );

    vec3 color = isNegative ? 1.0 - vec3(r, g, b) : vec3(r, g, b);

    gl_FragColor = vec4(color + brightness, opacity);
  }
`
