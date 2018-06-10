import { fromJS } from 'immutable';
import { LIVEWALL_FULLSCREEN } from './actions';

// const initialState = fromJS({
//   fullScreen: false,
// });
const initialState = {
  fullScreen: false,
};

const reducer = (state = initialState, action) => {
  console.log('LiveWallFullScreenReducer:: ', state.fullScreen, action.type, LIVEWALL_FULLSCREEN);
  switch (action.type) {
    case LIVEWALL_FULLSCREEN:
    //   return state
    //     .set('fullScreen', initialState.get('fullScreen'));
      return { ...state, fullScreen: !state.fullScreen };
    default:
      return state;
  }
};

export default reducer;
