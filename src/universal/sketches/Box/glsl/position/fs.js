import noise from '../../../lib/glsl/noise'

export default `

  precision mediump float;

  uniform vec2 resolution;
  uniform sampler2D texturePosition;
  uniform float time;
  uniform float rand;

  ${noise}

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 pos = texture2D(texturePosition, uv);
    float x = snoise(vec3(pos.x, uv.x, uv.y));
    float y = snoise(vec3(pos.y, uv.x, uv.y));
    float z = snoise(vec3(pos.z, uv.x, uv.y));

    vec3 _pos = normalize(vec3(x, y, z)) * 30.0;

    gl_FragColor = vec4(_pos, 1.0);
  }
`
