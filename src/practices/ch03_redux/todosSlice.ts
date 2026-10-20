import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

/**
 *  1. 할 일 항목(TodoItem) 1개의 데이터 규격 정의
 */

export interface TodoItem {
    id: string;      // 고유 식별자
    title: string;   // 할 일 제목
    done: boolean;   // 완료 여부
}

/**
 * 2. 보기 필터 조건 타입('all' : 전체, 'open' : 미완료, 'done' : 완료)
 */
export type FilterType = 'all' | 'open' | 'done';

/**
 * 3. todoSlice가 관리할 상티(State) 규격
 */
export interface TodoState {
    items: TodoItem[];   // 할 일 항목 배열
    filter: FilterType; // 현재 보기 필터 조건
}

/**
 * 4. 초기 상티(initialState) : 빈 배열과 'all'(전체 보기)로 시작
 */
const initialState: TodoState = {
    items: [],
    filter: 'all',
}

/**
 * 5. createSlice로 초기상태, 상태 변경 규칙(reducers), action creater를 한번에 생성
 */
const todosSlice = createSlice({
    name: 'todos', // 자동 생성되는 action.type의 접두사 (예: 'todos/todoAdded')
    initialState,
    reducers: {
        // [규칙 1] 할 일 추가: prepare에서 payload 객체를 먼저 조립한 뒤 reducer로 전달
        todoAdded: {
            reducer(state, action: PayloadAction<TodoItem>) {
            // Immer가 적용되어 있으므로 draft 배열에 안전하게 push 가능!
            state.items.push(action.payload);
            },
        prepare(title: string) {
            // id 생성이나 문자열 손질(trim)은 reducer 본문이 아니라 prepare에서 처리합니다.
            return {
            payload: {
                id: nanoid(),        // 고유하고 안정적인 랜덤 ID 생성
                title: title.trim(), // 앞뒤 공백 제거
                done: false,         // 처음 추가될 때는 미완료(false) 상태
                },
            };
        },
    },

    // [규칙 2] 할 일 완료/미완료 토글: 전달받은 id와 일치하는 항목을 찾아 done 반전
    todoToggled(state, action: PayloadAction<string>) {
        const target = state.items.find(item => item.id === action.payload);
        if (target) {
            target.done = !target.done; // Immer draft 객체의 속성을 직접 변경
        }
        },

    // [규칙 3] 할 일 삭제: 전달받은 id와 다른 항목들만 남겨 새 배열로 교체
    todoRemoved(state, action: PayloadAction<string>) {
        state.items = state.items.filter(item => item.id !== action.payload);
        },

    // [규칙 4] 보기 필터 변경: 'all' | 'open' | 'done' 중 전달받은 조건으로 변경
    filterChanged(state, action: PayloadAction<FilterType>) {
        state.filter = action.payload;
        },
    },
});

// 컴포넌트에서 dispatch할 때 사용할 Action Creator 함수들을 내보냅니다.
export const {
    todoAdded,
    todoToggled,
    todoRemoved,
    filterChanged,
} = todosSlice.actions;

// store에 등록할 reducer 함수를 기본(default)으로 내보냅니다.
export default todosSlice.reducer;