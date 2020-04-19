import React from 'react';
import Link from 'next/link';

import NavBar from '../NavBar';

export default function Header() {
    return (
        <div className="bg-gray-200">
            <Link href="/">
                <a>
                    <h1>
                        <img src="/logo.png" alt="Olá FSL!" className="h-24 mx-auto py-4" />
                    </h1>
                </a>
            </Link>

            <NavBar />
        </div>
    );
}
