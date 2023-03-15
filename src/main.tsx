import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import TodoApp from './TodoApp'
import { store } from './redux/app/store'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={ store }>
    <TodoApp />
  </Provider>
)
