const env = process.env.NODE_ENV || 'local'

const config = {
  local: {
    env: 'local',
    useGui: true,
    useOrbitControls: true,
    useAxisHelper: true,
  },
  production: {
    env: 'production',
    useGui: false,
    useOrbitControls: false,
    useAxisHelper: false,
  },
}

export default config[ env ]
