import React from 'react';
import Enzyme, { shallow } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import { findAttr } from '../../../Main/testUtils'
import Home from '../Home'

Enzyme.configure({adapter: new EnzymeAdapter() })


//Return Shallow Rendered Component
const setup = ( props = {} ) => {
    return shallow(<Home {...props}/>)
}
//-------------------------------//


test('Renders without crashing', () => {
    const wrapper = setup()
    const comp = findAttr(wrapper, 'comp-home')
    expect(comp.length).toBe(1)
})

test('Renders log-in button', () => {
    const wrapper = setup()
    const button = findAttr(wrapper, 'log-in-btn')
    expect(button.length).toBe(1)
})

test('Sign Up Button Navigates', () => {
    const wrapper = setup()
    const button = findAttr(wrapper, 'log-in-btn')
    button.simulate('click')
})