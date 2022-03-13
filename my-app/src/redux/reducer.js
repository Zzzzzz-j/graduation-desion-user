import { USERINFO } from './action-types'

const initState = { //初始化状态
    user_info: {}
}
export default function countReducer(preState=initState,action){
	const {type,data} = action
	switch (type) {
		case USERINFO: 
			return {...preState, user_info: data}
		default:
			return preState
	}
}