import React from 'react';

export default function NavBar() {
    return (
        <nav className="w-full flex flex-row justify-center items-center p-4">
            <p className="mr-4">Logo</p>
            <input
                className="p-2 border rounded"
                placeholder="What do you want to watch?"
                readOnly
            />
            <button className='bg-neutral-400 p-2 rounded ml-4'>Sign in</button>
        </nav>
    );
}
