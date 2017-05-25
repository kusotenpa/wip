import noise from '../../lib/glsl/noise'

export default `

  attribute vec3 position;
  attribute float vertexNumber;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

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
  uniform float time;

  ${noise}

  // 0.0 ~ 1.0
  float random(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  void main() {
    vec3 newPosition;

    float noise = snoise(vec3(
      position.x * .015 + time * .5,
      position.y * .015 + time * .5,
      position.z * .015 + time * .5
    ));

    newPosition.x = mod(vertexNumber, float(targetVertex)) != 0. ? position.x
      : isAddX ? position.x + (noise * 20.)
      : isMultiX ? position.x * (noise * 20.)
      : isDivX ? position.x / (noise * 200.)
      : position.x;

    newPosition.y = mod(vertexNumber, float(targetVertex)) != 0. ? position.y
      : isAddY ? position.y + (noise * 20.)
      : isMultiY ? position.y * (noise * 20.)
      : isDivY ? position.y / (noise * 200.)
      : position.y;

    newPosition.z = mod(vertexNumber, float(targetVertex)) != 0. ? position.z
      : isAddZ ? position.z + (noise * 20.)
      : isMultiZ ? position.z * (noise * 20.)
      : isDivZ ? position.z / (noise * 200.)
      : position.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }

`
