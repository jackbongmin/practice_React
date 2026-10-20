import { PracticeItem } from '../types/practice';
import { JsxBasicsPractice } from './ch01_basics/JsxBasicsPractice';
import { UserDataPractice } from './ch01_data/UserDataPractice';
import { CounterPractice } from './ch02_counter/CounterPractice';
import { ReduxTodoPractice } from './ch03_redux/ReduxTodoPractice';

/**
 * 실습 목록 등록소 (새 실습 컴포넌트를 만들면 여기에 추가합니다)
 */
export const practiceRegistry: PracticeItem[] = [
  {
    id: 'ch01-basics',
    title: 'JSX 기초 & 가상 DOM',
    chapter: 'Ch 01',
    description: 'JSX 문법, 표현식 바인딩, 가상 DOM의 즉각적 렌더링 원리',
    component: JsxBasicsPractice,
  },
  {
    id: 'ch01-data',
    title: '랜덤 데이터 & 컴포넌트',
    chapter: 'Ch 01-05',
    description: 'Chance와 Luxon을 이용한 모의 데이터 생성 및 프로필 렌더링',
    component: UserDataPractice,
  },
  {
    id: 'ch02-counter',
    title: 'Props & State 카운터',
    chapter: 'Ch 02',
    description: '컴포넌트 간 데이터 전달과 useState 훅을 통한 상태 관리',
    component: CounterPractice,
  },
  {
    id: 'ch03-redux',
    title: 'Redux Toolkit 상태 관리',
    chapter: 'Ch 03',
    description: 'Redux Toolkit을 사용한 상태 관리 실습',
    component: ReduxTodoPractice,
  }
];
