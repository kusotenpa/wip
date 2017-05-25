export default `

  precision mediump float;

  uniform vec2 resolution;
  uniform sampler2D textureVelocity;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float idParticle = uv.y * resolution.x + uv.x;
    vec4 tmpVel = texture2D( textureVelocity, uv );
    vec3 vel = tmpVel.xyz;

    gl_FragColor = vec4( vel.xyz, 1.0 );
  }
`
