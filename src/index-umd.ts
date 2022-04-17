import * as utils from './utils';
import * as layerUtils from './L.FreieTonne';
import FreieTonne from './L.FreieTonne';

export default Object.assign(FreieTonne, {
    ...utils,
    ...layerUtils
});