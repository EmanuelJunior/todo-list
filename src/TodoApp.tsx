import { useEffect, useState } from 'react'
import moment from 'moment';

import { useAddTodoMutation, useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation, ITodoApi } from './redux/features/todoApi';

function App() {

  const [query, setQuery] = useState<Pick<ITodoApi, 'status' | 'todo'>>({
    status: 'all',
    todo: '',
  });

  const { data: todos = [], isLoading } = useGetTodosQuery( query );

  const [addTodo] = useAddTodoMutation()
  const [updateTodo] = useUpdateTodoMutation()
  const [deleteTodo] = useDeleteTodoMutation()

  const [ inputTodo, setInputTodo ] = useState< string | Pick<ITodoApi, 'id' | 'todo'> >('');
  const [ section, setSection ] = useState<'all' | 'active' | 'complete'>('all');
  const [ isSearchTask, setIsSearchTask ] = useState( false );

  useEffect(() => {

    if ( isSearchTask ) {
      setIsSearchTask( false );
      setInputTodo('');
    }
    
    setQuery({ status: section, todo: '' });

  }, [ section ])

  const handleCheckboxChange = async ( e: React.ChangeEvent<HTMLInputElement>, id: string ) => {
    const { checked } = e.target;
    await updateTodo({ id, status: checked ? 'complete' : 'active' })
  }

  const addNewTask = async ( e: React.KeyboardEvent<HTMLInputElement> ) => {

    if ( 
      e.key === 'Enter' 
      && typeof inputTodo === 'string' 
      && inputTodo.trim() !== '' 
    ) {
      const { value } = e.target as HTMLInputElement;
      await addTodo({ todo: value.trim() });
      setInputTodo('');
    }
  }

  const updateTask = async ( e: React.KeyboardEvent<HTMLInputElement> ) => {

    if ( e.key === 'Enter' ) {
      
      if ( typeof inputTodo !== 'string' && inputTodo.todo.trim() !== '' )
        await updateTodo({
          id: inputTodo.id,
          todo: inputTodo.todo.trim(),
        })

      setInputTodo('');
    }
  }

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {

    const { value } = e.target as HTMLInputElement;
    
    if ( typeof inputTodo === 'string' ) setInputTodo( value );
    else setInputTodo({ ...inputTodo, todo: value });
    
    if ( isSearchTask && typeof inputTodo === 'string' )
      setQuery({ status: section, todo: value.trim() });
  }

  const handleDeleteTodo = async ( e: unknown, id: string ) => {
    await deleteTodo( id );
  }

  const handleEditTodo = ( e: unknown, todo: Pick<ITodoApi, 'id' | 'todo'> ) => {
    setInputTodo( todo );
  }

  return (
    <main className='h-screen bg-fixed bg-no-repeat bg-cover flex justify-center items-center' style={{ backgroundImage: 'linear-gradient( 102.7deg, rgba(253,218,255,1) 8.2%, rgba(223,173,252,1) 19.6%, rgba(173,205,252,1) 36.8%, rgba(173,252,244,1) 73.2%, rgba(202,248,208,1) 90.9% )' }}>
      <article className='todo-container bg-white rounded-lg shadow-xl w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 overflow-hidden'>
        
        <header className='p-5 pb-3'>
          <h3 className='font-bold text-md text-gray-700 mb-2'>
            { moment().format('dddd D [de] MMMM [de] YYYY') }
          </h3>

          <div className='flex justify-between items-center flex-wrap'>
            <div className='w-1/4'>
              <p className='text-gray-400 text-sm'>{ todos.length } tasks</p>
            </div>

            <div className='w-3/4 flex justify-end items-center flex-wrap'>
              <button 
                className={`block text-sm text-gray-400 border border-transparent ${ section === 'all' ? 'bg-blue-400 text-white hover:text-white' : 'hover:text-blue-500' } hover:border-blue-500 active:text-white mr-2 active:bg-blue-400 transition-all px-2 rounded-full`}
                onClick={ () => setSection('all') }
              >
                All
              </button>

              <button 
                className={`block text-sm text-gray-400 border border-transparent ${ section === 'active' ? 'bg-yellow-500 text-white hover:text-white' : 'hover:text-yellow-500' } hover:border-yellow-500 active:text-white mr-2 active:bg-yellow-500 transition-all px-2 rounded-full`}
                onClick={ () => setSection('active') }
              >
                Active
              </button>

              <button 
                className={`block text-sm text-gray-400 border border-transparent ${ section === 'complete' ? 'bg-green-500 text-white hover:text-white' : 'hover:text-green-500' } hover:border-green-500 active:text-white active:bg-green-500 transition-all px-2 rounded-full`}
                onClick={ () => setSection('complete') }
              >
                Completed
              </button>

            </div>
          </div>
        </header>

        <section className='flex justify-center items-center relative'>
          <input 
            type="text" 
            placeholder={

              typeof inputTodo !== 'string' 
                ? 'The task cannot be empty' 

                : isSearchTask
                  ? 'You are in search mode' 
                  : 'Add a new task...'
            } 
            className={`px-5 pb-2 w-full outline-none text-sm ${ todos.length === 0 && 'border-b' }`} 
            value={ typeof inputTodo === 'string' ? inputTodo : inputTodo?.todo }
            onChange={ handleInputChange }
            onKeyUp={ typeof inputTodo === 'string' ? isSearchTask ? () => {} : addNewTask : updateTask }
          /> 

          <img 
            width={ 20 }
            height={ 20 }
            className='absolute right-2 top-3 transform -translate-y-1/2 cursor-pointer'
            src="https://uxwing.com/wp-content/themes/uxwing/download/user-interface/search-icon.png" 
            alt="search"
            onClick={ () => setIsSearchTask( !isSearchTask ) }
          />

        </section>

        <ul>
          {
            todos.length > 0 ?
              todos?.map( todo  => { 
                return (
                  <li className={`flex justify-between items-center border-t p-3 task-item relative ${ todo.status === 'complete' ? 'bg-green-50' : typeof inputTodo !== 'string' && inputTodo.id === todo.id ? 'bg-blue-50' : 'bg-transparent' }`} key={ todo.id }>
                    <div className='flex justify-center items-center'>
                      <input type="checkbox" className="task-status" checked={ todo.status === 'complete' ?? false } onChange={ (e) => handleCheckboxChange(e, todo.id) }/>
                      <span className={"text-sm text-gray-500"} style={{ textDecoration: `${ todo.status === 'complete' ? 'line-through wavy rgba(0, 0, 0, 0.3)' : 'none' }` }}>{ todo.todo }</span>
                    </div>

                    <div className={`flex justify-end items-center`} key={ todo.id }>
                      <button className="task-edit" onClick={ (e) => handleEditTodo(e, todo) }></button>
                      <button className="task-delete" onClick={ (e) => handleDeleteTodo(e, todo.id) }></button>
                    </div>
                  </li>
                )
              }
              )
            :
              <li className='flex justify-center items-center p-3 h-36 task-empty bg-no-repeat bg-center'>
                <span className='text-sm text-gray-600'>Not found a task</span>
              </li>
          }
        </ul>

      </article>
    </main>
  )
}

export default App
