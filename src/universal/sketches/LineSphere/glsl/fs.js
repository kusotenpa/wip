import noise from '../../lib/glsl/noise'

export default `

  precision mediump float;

  uniform vec2 resolution;

  ${noise}

  void main() {
    float a = snoise(vec3(gl_FragCoord.xyz));
    // vec3 color = vec3(a);
    vec3 color = vec3(1.);
    gl_FragColor = vec4(color, .7);
  }
`
