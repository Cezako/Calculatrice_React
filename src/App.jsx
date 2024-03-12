import { useState, useReducer } from 'react'
import './App.css'
import TextBox from './component/TextBox.jsx'
import Button from './component/Button.jsx'


const padNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

const initialState = {
    expression: [],
    textBox: '',
    resultBox: ''
}

const reducer = (state, action) => {
    switch (action.type) {

        case 'set_value':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }

        case 'add_number':
            return {
                ...state,
                textBox: state.textBox + action.payload.value
            }


        case 'addition':
            return {
                ...state,
                expression: [...state.expression, state.textBox, '+'],
                textBox: initialState.textBox,
            }

        case 'soustract':
            return {
                ...state,
                expression: [...state.expression, state.textBox, '-'],
                textBox: initialState.textBox,
            }

        case 'multiply':
            return {
                ...state,
                expression: [...state.expression, state.textBox, '*'],
                textBox: initialState.textBox,
            }

        case 'calculate':
            const expression = [...state.expression, state.textBox]
            let result = parseFloat(expression[0])

            for (let i = 1; i < expression.length; i += 2) {
                const operator = expression[i]
                const operand = parseFloat(expression[i + 1])

                if (operator === '+') {
                    result += operand
                } else if (operator === '-') {
                    result -= operand
                } else if (operator === '*') {
                    result *= operand
                } else if (operator === '/') {
                    result /= operand
                }
            }
            
            result = expression.map(item => String(item)).join('') + '=' + result

            return {
                ...state,
                expression: initialState.textBox,
                textBox: initialState.textBox,
                resultBox: result
            }

        case "reset":
            return initialState

        default:
            return state
    }
}


const App = () => {

    const [state, dispatch] = useReducer(reducer, initialState)

    const addNumber = (value) => {
        dispatch({type: 'add_number' , payload: {value}})
    }

    const addition = () => {
        dispatch({type: 'addition'})
    }

    const soustact = () => {
        dispatch({type: 'soustract'})
    }

    const multiply = () => {
        dispatch({type: 'multiply'})
    }

    const calculate = () => {
        dispatch({type: 'calculate'})
    }

    return (
        <>
            <TextBox text={state.textBox} />
            <TextBox text={state.resultBox} />
            <div>
                {padNumbers.map(number => (
                    <Button key={number} name={number} handleClick={() => addNumber(number)}/>
                ))}
                <Button name={'+'} handleClick={addition} />
                <Button name={'-'} handleClick={soustact} />
                <Button name={'*'} handleClick={multiply} />
                <Button name={'reset'} handleClick={()=> dispatch({type: 'reset'})} />
                <Button name={'='} handleClick={calculate} />
                
            </div>
        </>
    )
}

export default App