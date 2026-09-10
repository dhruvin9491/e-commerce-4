import { COUNTER_ACTION } from "../../constants/ActionConstant";

const initialValue = {
    count: 0
}

export const counterReducer = (state = initialValue, action) => {
    console.log(state, action);
    switch (action.type) {
        case COUNTER_ACTION.INCREMENT:
            return {
                count: state.count + 1
            }

        case COUNTER_ACTION.DECREMENT:
            return {
                count: state.count - 1
            }

        case COUNTER_ACTION.RESET:
            return {
                count: 0
            }

        default:
            return state;

    }

}