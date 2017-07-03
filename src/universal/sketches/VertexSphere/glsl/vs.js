export default `

  attribute float freq;
  attribute float _index;

  uniform float time;

  varying float vFreq;
  varying float vIndex;

  const float FREQ_NUM = 255.;

  void main() {
    float _freq = freq / FREQ_NUM;
    vFreq = _freq;
    vIndex = _index;
    vec3 newPos = _freq == 0. ? cos(time / 1000000. * _index) + position : normal * _freq * 30. + position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.);
  }

`
