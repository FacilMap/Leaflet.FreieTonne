import * as utils from './utils';
import * as layerUtils from './L.FreieTonne';
import FreieTonne from './L.FreieTonne';
export * from './utils';
export * from './L.FreieTonne';

export default FreieTonne;

const FreieTonneExport = Object.assign(FreieTonne, {
    ...utils,
    ...layerUtils
});