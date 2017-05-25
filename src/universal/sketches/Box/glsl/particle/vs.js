export default `

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform sampler2D texturePosition;

  attribute vec2 uv;

  void main() {
    vec4 pos = texture2D(texturePosition, uv);

    gl_PointSize = 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
  }

`
