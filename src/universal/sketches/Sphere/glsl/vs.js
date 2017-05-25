export default `

  attribute vec3 position;
  attribute vec3 centroid;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float PI;
  uniform float time;

  // 0.0 ~ 1.0
  float random(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  mat3 rotateX(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
      1., 0., 0.,
      0., c, -s,
      0., s, c
    );
  }

  mat3 rotateY(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
      c, 0., s,
      0., 1., 0.,
      -s, 0., c
    );
  }

  void main() {
    vec2 waveLength = vec2(1., .25);
    vec2 rad = position.xy * PI * waveLength;
    vec2 speed = vec2(15., 12);
    vec2 offset = time * speed;

    vec3 posTriangle = position - centroid;
    posTriangle = rotateX(rad.x + offset.x) * rotateY(rad.y + offset.y) * posTriangle;
    vec3 pos = posTriangle + centroid;

    float delay = 3.;

    // -delay ~ 0.
    float start = random(centroid.xy) * -delay;

    // 0. ~ (delay + 1.)
    float current = (-cos(time / 3.) * .5 + .5) * (delay + 1.);

    float rate = clamp(start + current, 0., 1.);

    gl_Position = projectionMatrix * viewMatrix * vec4(mix(position, pos, rate), 1.);
  }

`
