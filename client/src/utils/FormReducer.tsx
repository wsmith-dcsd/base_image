interface FormState {
    [fieldName: string]: unknown;
}

interface FormAction {
    type: "reset";
    payload: FormState;
}

interface TextFormAction {
    type: "text";
    field: string;
    payload: unknown;
}

type FormActionTypes = FormAction | TextFormAction;

/**
 *  Handle controlled inputs
 *  The "text" action can handle many different input types including text, textarea, radio, date, email, and select lists
 *  @TODO: Other form types can be added to this (like toggle types)
 */
const FormReducer = (state: FormState, action: FormActionTypes): FormState => {
    switch (action.type) {
        case "reset":
            return action.payload;
        case "text":
            return {
                ...state,
                [action.field]: action.payload
            };
        default:
            return state;
    }
};

export default FormReducer;
