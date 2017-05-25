export default `

  precision mediump float;

  // uniform sampler2D textureVelocity;
  // uniform float time;
  uniform vec2 resolution;
  uniform sampler2D texturePosition;
  uniform float velocity;
  uniform vec2 targetPoint;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 pos = texture2D(texturePosition, uv);
    vec2 targetDirection = normalize(targetPoint - pos.xy) * 0.2;
    vec2 direction = normalize(targetDirection + pos.zw);

    gl_FragColor = vec4(pos.xy + direction * velocity * 2.0, direction);
  }

`
