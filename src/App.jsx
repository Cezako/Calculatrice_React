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


const addCurrent = (state, value) => {

    const currentExpression = state.expression
    const lastElement = currentExpression[currentExpression.length - 1]

    //console.log(value)
    //console.log(lastElement)

    // si valeur est un chiffre, renvoyer le chiffre, sinon verifier si l'élément est correctement saisi
    if (padNumbers.map(number => number === value).includes(true)) {
        return {
            ...state,
            textBox: state.textBox + value
        }

    } else {
        let newExpression
        if (lastElement === '+' || lastElement === '-' || lastElement === '*' || lastElement === '/' || lastElement === '.') {
            newExpression = [
                ...currentExpression.slice(0, -1),
                state.textBox,
                value
            ]
        } else {
            newExpression = [
                ...currentExpression,
                state.textBox,
                value
            ]
        }

        return {
            ...state,
            expression: newExpression,
            textBox: initialState.textBox,
        }
    }
}


const reducer = (state, action) => {
    switch (action.type) {

        case 'add_number':
            return addCurrent(state, action.payload.value)

        case 'addition':
            return addCurrent(state, '+')
        
        case 'soustract':
            return addCurrent(state, '-')
        
        case 'multiply':
            return addCurrent(state, '*')
        
        case 'divide':
            return addCurrent(state, '/')

        case 'calculate':
            let expression = [...state.expression, state.textBox]
            let errorMessage = ''
        
            // Priority multiply & divide
            for (let i = 1; i < expression.length; i += 2) {
                const operator = expression[i]
                const operand = parseFloat(expression[i + 1])
        
                if (operator === '*') {
                    expression[i - 1] *= operand
                    expression.splice(i, 2)
                    i -= 2
                } else if (operator === '/') {
                    expression[i - 1] /= operand
                    expression.splice(i, 2)
                    i -= 2
                }
            }
        
            let result = parseFloat(expression[0])
        
            for (let i = 1; i < expression.length; i += 2) {
                const operator = expression[i]
                const operand = parseFloat(expression[i + 1])
        
                if (operator === '+') {
                    result += operand;
                } else if (operator === '-') {
                    result -= operand
                }
            }

            try {
                if (!isFinite(result)) {
                    throw new Error('Error')
                }
            } catch (error) {
                errorMessage = error.message
            }
        
            return {
                ...state,
                expression: initialState.textBox,
                textBox: initialState.textBox,
                resultBox: errorMessage ? errorMessage : result
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

    const divide = () => {
        dispatch({type: 'divide'})
    }

    const calculate = () => {
        dispatch({type: 'calculate'})
    }

    return (
        <div className='calculator'>
            <TextBox text={state.textBox} />
            <TextBox text={state.resultBox} />
            <div>
                {padNumbers.map(number => (
                    <Button key={number} name={number} handleClick={() => addNumber(number)}/>
                ))}
                <Button name={'.'} handleClick={() => addNumber('.')} />
                <Button name={'+'} handleClick={addition} />
                <Button name={'-'} handleClick={soustact} />
                <Button name={'*'} handleClick={multiply} />
                <Button name={'/'} handleClick={divide} />
                <Button name={'reset'} handleClick={()=> dispatch({type: 'reset'})} />
                <Button name={'='} handleClick={calculate} />
                
            </div>
        </div>
    )
}

export default App