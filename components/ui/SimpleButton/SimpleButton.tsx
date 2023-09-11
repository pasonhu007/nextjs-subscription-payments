'use client'

import React, { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    Component?: React.ComponentType;
}

const SimpleButton = (props: Props) => {
    const {
        children,
        ...rest
    } = props
    return (
        <button 
            type="button" 
            { ...rest }
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                { children }
        </button>
    )
}

export default SimpleButton