import React from 'react';

import NavBar from '../NavBar';

export default function Footer() {
    return (
        <div className="py-4 text-center bg-gray-400">
            <strong>My Daily Status</strong> é um projeto criado durante o <a href="https://www.youtube.com/playlist?list=PLBNBxpMAbyhWpAtK3Oulk_j6pRTzL46gq">FullStack Lab do DevPleno</a>
            <p>Implementado por <a className="hover:underline" href="https://linkedin.com/in/netojocelino">Neto Jocelino</a></p>
        </div>
    );
}