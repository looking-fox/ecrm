import React from 'react';
import Enzyme, { shallow } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import Home from '../Home'

Enzyme.configure({adapter: new EnzymeAdapter() })

//----Helper Functions-----//
//TODO: Move to Main Folder as universal helper functions for testing purposes. 

//Return Shallow Rendered Component
const setup = (props = {}, state = null) => {
    return shallow(<Home {...props}/>)
}

//Return Array of Elements with given data-test attribute
const findAttr = (wrapper, value) => {
    return wrapper.find(`[data-test="${value}"]`)
}

//----Helper Functions-----//


test('Renders Without Crashing', () => {
    const wrapper = setup()
    const comp = findAttr(wrapper, 'comp-home')
    expect(comp.length).toBe(1)
})