import React, { useState } from 'react'
import { FaFileCode } from "react-icons/fa";

const FolderSection = () => {

    const [fileTree, setFileTree] = useState({
        "app.js": {
            content: `const express = require('express');`
        },
        "package.json": {
            content: `{
           "name": "temp-server",
          }`
        }
    });
    const [currentFile, setCurrentFile] = useState(null);


    return (
        <div>
            <div className="explorer h-full w-full p-3">
                <div className="file-tree">
                    {
                        Object.keys(fileTree).map((file, index) => (
                            <div className="tree-element p-2 flex cursor-pointer border-b border-zinc-800 items-center w-full">
                                <p className='text-white text-lg flex justify-center items-center gap-1'>
                                    <FaFileCode />
                                    {file}
                                </p>
                            </div>
                        ))
                    }

                </div>
            </div>
            <div className="code-editor"></div>
        </div>

    )
}

export default FolderSection