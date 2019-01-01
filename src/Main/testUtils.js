import React from 'react';
import Enzyme, { shallow } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'
import Lists from '../components/Sidebar/Lists'

Enzyme.configure({adapter: new EnzymeAdapter() })


//----Helper Functions-----//

//Return Array of Elements with given data-test attribute
export const findAttr = (wrapper, value) => {
    return wrapper.find(`[data-test="${value}"]`)
}

//----Helper Functions-----//
