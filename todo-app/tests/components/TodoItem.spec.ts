import { describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import TodoItem from '@/components/TodoItem.vue';

describe('TodoItem', () => {
  const todo = {
    id: 1,
    userId: 1,
    title: 'Test task',
    completed: false,
    createdAt: '2026-06-01T10:00:00.000Z',
    tagIds: [],
  };

  it('renders todo title', () => {
    const wrapper = shallowMount(TodoItem, {
      props: { todo },
    });

    expect(wrapper.text()).toContain('Test task');
  });

  it('emits delete event', async () => {
    const wrapper = shallowMount(TodoItem, {
      props: { todo },
    });

    await wrapper.vm.$emit('delete', 1);
    expect(wrapper.emitted('delete')?.[0]).toEqual([1]);
  });
});
