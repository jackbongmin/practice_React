import { configureStore } from '@reduxjs/toolkit';
import todosReducer, { TodoState } from './todosSlice';

// 브라우저 localStorage에 저장할 고유 키 이름
const STORAGE_KEY = 'redux-todo-practoce-state';

/**
 * 중앙 상태 저장소(Store) 생성
 * - reducer 객체에 등록한 키 이름('todos')이 곧 전체 상태 트리의 경로(state.todos)가 됩니다.
 */


/**
 * 1. 브라우저가 처음 켜지거나 새로고침이 될때 localStorage에서 이전 상태를 읽어오는 함수
 */
function loadFromLocalStorage(): {todos: TodoState}|undefined {
    try {
        const serialized = localStorage.getItem(STORAGE_KEY);
        if (!serialized) {
            return undefined;
        }
        return {
            todos: JSON.parse(serialized) as TodoState,
        };
    } catch (error) {
        console.error('Error loading state from localStorage:', error);
        return undefined;
    }
}

/**
 * 2. store의 상태가 바뀔 때 마다 localStorage에 최신 todo 상태를 저장하는 함수
 */
function saveToLocalStorage(todosState: TodoState): void {
    try {
        const serialized = JSON.stringify(todosState);
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
        console.error('Error saving state to localStorage:', error);
    }
}

/**
 * 3. 중앙 상태 저장소(Store) 생성
 *  - preloadedState 옵션에 loadFromLocalStorage() 결과를 넣어주면,
 *   새로고침 직후에도 이전에 저장해 둔 할 일 목록으로 즉시 복원
 */
export const store = configureStore({
    reducer: {
        todos: todosReducer,
    },
    preloadedState: loadFromLocalStorage(),
});

/**
 * 4. store 구독(subscribe) 연결
 * - 컴포넌트에서 dispatch(action)가 일어나 store 상태가 갱신될 때마다 자동으로 실행됩니다.
 * - reducer 바깥에서 저장 부수 효과(Side Effect)를 처리하므로 Redux 원칙을 완벽히 준수합니다.
 */
store.subscribe(() => {
    const currentState = store.getState();
    saveToLocalStorage(currentState.todos);
});

// TypeScript 환경에서 useSelector와 useDispatch를 안전하게 쓰기 위한 타입 추출
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;