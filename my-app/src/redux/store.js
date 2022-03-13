import { createStore } from 'redux'
//引入为Count组件服务的reducer
import reducer from './reducer'
//暴露store
export default createStore(reducer)