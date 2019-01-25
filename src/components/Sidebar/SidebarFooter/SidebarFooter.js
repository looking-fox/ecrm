import React from 'react'
import PropTypes from 'prop-types';
import Logo from '../../../assets/logo.png'

export default function SidebarFooter(props) {
    return (
        <div className="sidebar-footer">
            <img src={Logo} alt="Fox Logo" />
            <i className="far fa-question-circle"
                onClick={props.toggleTutorial}
            />
            <a href="https://app.termly.io/document/terms-of-use-for-saas/c574334a-93e2-4fc1-a7b4-63c6ae0b00e4">
                Terms of Service
            </a>

            <a href="https://app.termly.io/document/privacy-policy/1eb8b9ce-5fa7-427e-8df2-157a19f61807">
                Privacy Policy
            </a>
        </div>
    )
}
SidebarFooter.propTypes = {
    toggleTutorial: PropTypes.func.isRequired
}