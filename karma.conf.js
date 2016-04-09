// module.exports = function(config) {
//   config.set({
//     basePath: '',
//     frameworks: ['jasmine'],
//     files: [
//       'lib/qt.js',
//       { pattern: 'lib/qt.js.map', included: false },
//       'tests/common.js',
//       'tests/failingTests.js',
//       'tests/*/**/*.js',
//       { pattern: 'tests/*/**/qmldir', included: false },
//       { pattern: 'tests/*/**/*.qml', included: false },
//       { pattern: 'tests/*/**/*.png', included: false }
//     ],
//     browsers: ['PhantomJSCustom'],
//     reporters: process.env.COVERALLS_REPO_TOKEN ?
//                    ['progress', 'coverage', 'coveralls'] :
//                    ['spec', 'coverage'],
//     coverageReporter: {
//       type: 'lcov',
//       dir: 'coverage/'
//     },
//     preprocessors: {
//       'lib/qt.js': ['coverage']
//     },
//     customLaunchers: {
//       PhantomJSCustom: {
//         base: 'PhantomJS',
//         options: {
//           onCallback: require('./tests/phantom.callback.js')
//         }
//       }
//     }
//   });
// };
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'build/qml2js-all.js',
      'tests/initPage.js',
      'tests/base/**/*.js', {
        pattern: 'tests/**/*.json',
        watched: true,
        served: true,
        included: false
      }, {
        pattern: 'tests/**/*.qml',
        watched: true,
        served: true,
        included: false
      },
    ],
    client: {
      captureConsole: true,
      mocha: {
        bail: true
      }
    },
    browsers: ['PhantomJSCustom' /*,'Chrome'*/ ],
    reporters: process.env.COVERALLS_REPO_TOKEN ?
      ['progress', 'coverage', 'coveralls'] : ['spec', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    preprocessors: {
      'build/qml2js-all.js': ['coverage']
    },
    customLaunchers: {
      PhantomJSCustom: {
        base: 'PhantomJS',
        options: {
          onCallback: require('./tests/phantom.callback.js')
        }
      }
    }
  });
};