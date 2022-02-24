import { 
    DialogAction, 
    DialogState, 
    DIALOG_STATE 
} from './types'

const INITIAL_STATE: DialogState = {
    dialogOpen: false,
    dialogLabel: '',
    dialogType: 'default',
    docId:''
}

export function dialogReducers(state = INITIAL_STATE, action: DialogAction): DialogState {
    switch(action.type) {
        case DIALOG_STATE:
            return { ...state, ...action.payload }
        default:
            return state
    }
}