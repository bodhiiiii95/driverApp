/** @format */

import {AppRegistry} from 'react-native';
import WrapperApp from './module/wrapper.js';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => WrapperApp);
