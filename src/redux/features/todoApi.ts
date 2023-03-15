import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface ITodoApi {
  id: string;
  todo: string;
  status?: 'active' | 'complete' | 'all';
}

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),

  tagTypes: ['Todos'],
  
  endpoints: ( builder ) => ({
    getTodos: builder.query<ITodoApi[], Partial< Pick<ITodoApi, 'todo' | 'status'> > >({
      query: ( query ) => {
        
        return {
          url: `/tasks${ query.status ? `?status=${query.status}&todo=${query.todo}` : '' }`,
        }
      },
      providesTags: ['Todos'],
    }),
    addTodo: builder.mutation<ITodoApi, Omit<ITodoApi, 'id'>>({
      query: ( body ) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Todos'],
    }),
    updateTodo: builder.mutation<ITodoApi, Partial<ITodoApi> | Partial<ITodoApi>>({
      query: ( body ) => ({
        url: `/tasks/${body.id}`,
        method: 'PATCH',
        body: {
          todo: body.todo,
          status: body.status,
        },
      }),
      invalidatesTags: ['Todos'],
    }),
    deleteTodo: builder.mutation<void, string>({
      query: ( id ) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
})

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todoApi;