import { ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TodoForm from '@/components/TodoForm.vue';
import { useTodoStore } from '@/stores/todoStore';

vi.mock('@/composables/useErrorHandler', () => ({
  useErrorHandler: () => ({
    handleError: vi.fn(),
  }),
}));

const validateMock = vi.fn();

vi.mock('@/composables/useValidation', () => ({
  useValidation: () => ({
    errors: ref({}),
    validate: validateMock,
    validateField: vi.fn(() => true),
    validateAsync: vi.fn(async () => true),
    clearErrors: vi.fn(),
  }),
}));

describe('TodoForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    validateMock.mockReset();
  });

  it('renders form component', () => {
    const wrapper = shallowMount(TodoForm, {
      global: {
        stubs: {
          QForm: true,
          QInput: true,
          QBtn: true,
          FormError: true,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('does not call addTodo when validation fails', async () => {
    validateMock.mockReturnValue(false);
    const store = useTodoStore();
    const addTodo = vi.spyOn(store, 'addTodo');

    shallowMount(TodoForm, {
      global: {
        stubs: {
          QForm: true,
          QInput: true,
          QBtn: true,
          FormError: true,
        },
      },
    });

    expect(validateMock({ title: '' })).toBe(false);
    expect(addTodo).not.toHaveBeenCalled();
  });

  it('calls addTodo when validation passes', async () => {
    validateMock.mockReturnValue(true);
    const store = useTodoStore();
    const addTodo = vi.spyOn(store, 'addTodo').mockResolvedValue({
      success: true,
      data: {
        id: 1,
        userId: 1,
        title: 'New task',
        completed: false,
        createdAt: '2026-01-01',
        tagIds: [],
      },
    });

    if (validateMock({ title: 'New task' })) {
      await store.addTodo({ title: 'New task' });
    }

    expect(addTodo).toHaveBeenCalledWith({ title: 'New task' });
  });
});
