import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';

/**
 * 중앙 상태 저장소(Store) 생성
 * - reducer 객체에 등록한 키 이름('todos')이 곧 전체 상태 트리의 경로(state.todos)가 됩니다.
 */
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

/**
 * 이 설정으로 만들어지는 전체 상태(State) 구조는 다음과 같습니다:
 * {
 *   todos: {
 *     items: [],
 *     filter: 'all'
 *   }
 * }
 */

// TypeScript 환경에서 useSelector와 useDispatch를 안전하게 쓰기 위한 타입 추출
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;