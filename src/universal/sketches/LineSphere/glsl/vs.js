import noise from '../../lib/glsl/noise'

export default `

  attribute vec3 position;
  attribute float vertexNumber;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  uniform float time;
  uniform float knob0;
  uniform int targetVertex;
  uniform bool isAddX;
  uniform bool isAddY;
  uniform bool isAddZ;
  uniform bool isMultiX;
  uniform bool isMultiY;
  uniform bool isMultiZ;
  uniform bool isDivX;
  uniform bool isDivY;
  uniform bool isDivZ;

  ${noise}

  // 0.0 ~ 1.0
  float random(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  void main() {
    vec3 newPosition;

    float noise = snoise(vec3(
      position.x * (2. * knob0 + .015) + time * (knob0 + .1),
      position.y * (2. * knob0 + .015) + time * (knob0 + .1),
      position.z * (2. * knob0 + .015) + time * (knob0 + .1)
    ));

    newPosition.x = mod(vertexNumber, float(targetVertex)) != 0. ? position.x
      : isDivX ? position.x / (noise * 200.)
      : isMultiX ? position.x * (noise * 20.)
      : isAddX ? position.x + (noise * 20.)
      : position.x;

    newPosition.y = mod(vertexNumber, float(targetVertex)) != 0. ? position.y
      : isDivY ? position.y / (noise * 200.)
      : isMultiY ? position.y * (noise * 20.)
      : isAddY ? position.y + (noise * 20.)
      : position.y;

    newPosition.z = mod(vertexNumber, float(targetVertex)) != 0. ? position.z
      : isDivZ ? position.z / (noise * 200.)
      : isMultiZ ? position.z * (noise * 20.)
      : isAddZ ? position.z + (noise * 20.)
      : position.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }

`
