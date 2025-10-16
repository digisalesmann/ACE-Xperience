// components/Link.js (This would use the real Next.js Link in a production app)

import React from 'react';

// Use this for now, but replace 'a' with the imported Next.js 'Link' in a real project
export default function Link({ href, children, className, ...props }) {
    return (
        <a href={href} className={className} {...props}>
            {children}
        </a>
    );
};