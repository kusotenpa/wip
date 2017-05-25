import noise from '../../lib/glsl/noise'

export default `

  precision highp float;

  uniform float time;
  uniform float x;
  uniform float y;
  uniform float z;
  uniform bool isHalf;
  uniform bool isNegative;

  varying vec2 vUv;

  ${noise}

  void main() {
    float r = snoise(vec3(x * vUv.x, y * vUv.y, z * time));
    float g = snoise(vec3(x * vUv.x, y * vUv.y, z * time));
    float b = snoise(vec3(x * vUv.x, y * vUv.y, z * time));

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

    gl_FragColor = vec4(vec3(r, g, b), 1.0);
  }

`
