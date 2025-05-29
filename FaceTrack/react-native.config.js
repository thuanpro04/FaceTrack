module.exports = {
    project: {
      android: {
        packageName: 'com.facetrack', // Đảm bảo đúng với cấu hình Android
      },
    },
    dependencies: {
      'react-native-vector-icons': {
        platforms: {
          ios: null,
        },
      },
    },
    assets: ['../FACETRACK/src/assets/fonts/'],
  };
  