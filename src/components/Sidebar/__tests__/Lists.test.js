import React from 'react';
import Enzyme, { shallow } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import { findAttr } from '../../../Main/testUtils'
import Lists from '../Lists'

Enzyme.configure({adapter: new EnzymeAdapter() })

//----Helper Functions-----//
//TODO: Move to Main Folder as universal helper functions for testing purposes. 

const setup = ( props={} ) => {
    return shallow(<Lists {...props} />)
}

test('Render without crashing', () => {
    const wrapper = setup(Lists)
    const comp = findAttr(wrapper, 'comp-lists')
    expect(comp.length).toBe(1)
})

test('Lists in state should be an empty array', () => {
    const wrapper = setup(Lists)
    const initialState = wrapper.state('lists')
    expect(initialState.length).toBe(0)
})

test('Should receive droppable ID from parent', () => {
    const wrapper = setup(Lists)
    const wrapperProps = wrapper.props()
    expect(Object.keys(wrapperProps)).toContain('droppableId')
})