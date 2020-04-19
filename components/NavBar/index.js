import React from 'react';
import Link from 'next/link';

export function NavLink({ href, children }) {
    return (
        <Link href={href}>
           <a className="p-2 hover:underline hover:text-red-800">{children}</a>
        </Link>
    );
}

export default function NavBar( ) {
    return (
        <nav className="bg-gray-500 py-4 text-center">
            <NavLink href="/about">Sobre</NavLink>
            <NavLink href="/signup">Cadastre-se</NavLink>
            <NavLink href="/signin">Entrar</NavLink>
        </nav>
    );
}
