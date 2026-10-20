import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './store';
import { todoAdded, todoToggled, todoRemoved, filterChanged, FilterType } from './todosSlice';
import './reduxTodo.css';

/**
 * [요약 컴포넌트] TodoSummary (교안 src/App.jsx 상단과 동일)
 * - 주목! 부모 컴포넌트로부터 아무런 props도 전달받지 않습니다!
 * - Provider 아래에 있기 때문에 useSelector로 직접 같은 store(state.todos.items)를 읽습니다.
 * - 완료 개수(completed)는 별도 state에 저장하지 않고 원본 items에서 즉시 계산(파생값)합니다.
 */

function TodoSummary() {
    const items = useSelector((state: RootState) => state.todos.items);
    const completed = items.filter(item => item.done).length;

    return (
        <p aria-live="polite" style={{ fontWeight: 600, color: '#2563eb', marginBottom: '16px' }}>
            전체 {items.length}개 / 완료 {completed}개
        </p>
    );
}

/**
 * [메인 할 일 컴포넌트] TodoApp(교안 src/App.jsx의 App 함수와 동일)
 */
function TodoApp() {
    // 1. 로컬상태(useState): 입력 중인 글자(title)는 입력 폼 안에서만 필요하므료 userState 사용
    const [title, setTitle] = useState('');

    // 2. 공유 상태 읽기(useSelector): store의 state.todos에서 원본 목록(items)과 필터(filter) 선택
    const items = useSelector((state: RootState) => state.todos.items);
    const filter = useSelector((state: RootState) => state.todos.filter);

    // 3. 액션 전달자(useDispatch): store에 action을 전달할 dispatch 함수 가져오기
    const dispatch = useDispatch();

    // 4. 파생값 계산(visibleItems): 필터 결과를 store에 중복 저장하지 않고 원본 items와 filter로 계산
    const visibleItems = items.filter(item =>
        filter === 'all' || (filter === 'done' ? item.done : !item.done)
    );

    // 5. 할 일 추가 폼 제출 핸들러
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // 폼 제출 시 브라우저 새로고침 방지
        if (!title.trim()) return; // 공백만 입력한 경우 추가 차단

        // todoAdded(title)로 action 객체를 생성하여 store에 dispatch!
        dispatch(todoAdded(title));
        // 정상 추가 후 입력창 비우기
        setTitle('');
    }

    return (
        <main className="redux-todo-main">
            <h1>Redux 할 일 목록</h1>

            {/* props를 하나도 넘기지 않아도 스스로 store를 읽어 개수를 표시함 */}
            <TodoSummary />

            {/* 1. 할 일 추가 폼 */}
            <form onSubmit={handleSubmit}>
                <label htmlFor = "title"> 할 일 </label>
                <input
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="할 일을 입력하세용~가리"
                />
                <button type="submit">추가</button>
            </form>

            {/* 보기 조건 필터 선택 */}
            <div className="filter-row">
                <label htmlFor="filter">보기 조건:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={event => dispatch(filterChanged(event.target.value as FilterType))}
                >
                    <option value="all">전체</option>
                    <option value="done">완료</option>
                    <option value="open">미완료</option>
                </select>
            </div>

            {/* 빈 목록 안내 문구 */}
            {visibleItems.length === 0 && (
            <p style={{ color: '#6b7280', padding: '12px 0' }}>표시할 할 일이 없습니다.</p>
            )}

            {/* 할 일 목록 렌더링 */}
            <ul>
                {visibleItems.map(item=> (
                    <li key={item.id}>
                        <input
                            type="checkbox"
                            aria-label={'${item.title} 완료'}
                            checked={item.done}
                            onChange={() => dispatch(todoToggled(item.id))}
                        />
                        <span className={item.done ? 'done' : ''}>{item.title}</span>
                        <button
                            type="button"
                            onClick={() => dispatch(todoRemoved(item.id))}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </main>

    )
}

/**
 * [대시보드 탑재용 래퍼] 교안의 src/main.jsx 역할(<Provider store={store}> 연결)
 * - useSelector와 useDispatch를 사용하는 모든 컴포넌트(TodoApp, TodoSummary)는
 *   반드시  <Provider store={store}> 내부에 있어야 한다.
 */

export const ReduxTodoPractice: React.FC = () => {
    return (
        <div className="practice-card">
            <div className="card-header">
                <span className="badge">Ch 05-09 실습</span>
                <h3>🏦 Redux Toolkit 상태 관리 (Todo App)</h3>
            </div>
            <p className="description">
                공유할 원본 상태(<code>items</code>, <code>filter</code>)는 <strong>Redux store</strong>에 두고,
                변경은 <strong>dispatch(action)</strong>으로 요청하며, 화면에 필요한 값(<code>completed</code>, <code>visibleItems</code>)은
                <strong>useSelector와 파생 계산</strong>으로 얻는 단방향 데이터 흐름 실습입니다.
            </p>
        <hr className="divider" />

        {/* 교안의 main.jsx에서 <Provider store={store}><App /></Provider>로 감싸는 것과 동일한 구조 */}
        <Provider store={store}>
            <TodoApp />
        </Provider>
        </div>
    );

}

export default ReduxTodoPractice;