import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../redux/saga';

const logger = createLogger();
const saga = createSagaMiddleware()

const store = createStore(
  rootReducer,
  undefined,
  applyMiddleware(saga,logger)
);

saga.run(rootSaga);

export default store;