module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        '@tamagui/babel-plugin',
        {
          config: './tamagui.config.ts',
          logTimings: true,
        },
      ],
    ],
  }
}
