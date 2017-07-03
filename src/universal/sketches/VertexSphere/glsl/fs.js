export default `

  precision mediump float;

  varying float vFreq;
  varying float vIndex;

  uniform float vertexLength;

  void main() {
    float hoge = mod(vIndex, 2.);
    gl_FragColor = vec4(
      0. / 255.,
      47. / 255.,
      207. / 255.,
      .8
    );
  }
`
