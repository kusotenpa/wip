import noise from '../../lib/glsl/noise'

export default `

  attribute vec3 position;
  attribute vec3 color;
  attribute vec2 uv;

  uniform float time;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float xxx;

  varying vec2 vUv;

  ${noise}

  void main() {
    float noise = snoise(vec3(
      position.x * 0.008 * xxx + time * 0.5,
      position.y * 0.01 * xxx + time * 0.5,
      position.z * 0.008 * xxx
    ));

    vec3 newPosition = vec3(
      position.x + (noise * 20.0),
      position.y + (noise * 20.0),
      position.z + (noise * 20.0)
    );

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }

`
