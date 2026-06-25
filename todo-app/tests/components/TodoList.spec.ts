import { describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TodoList from '@/components/TodoList.vue';

describe('TodoList', () => {
  const todos = [
    {
      id: 1,
      userId: 1,
      title: 'First',
      completed: false,
      createdAt: '2026-01-01',
      tagIds: [],
    },
  ];

  it('shows empty message when list is empty', () => {
    const wrapper = shallowMount(TodoList, {
      props: {
        todos: [],
        emptyMessage: 'Пусто',
      },
    });

    expect(wrapper.text()).toContain('Пусто');
  });

  it('renders todo items', () => {
    const wrapper = shallowMount(TodoList, {
      props: { todos },
    });

    expect(wrapper.findComponent({ name: 'TodoItem' }).exists()).toBe(true);
  });
});
