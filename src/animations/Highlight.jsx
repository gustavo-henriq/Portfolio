export function Highlight({children}){return <mark className="paint-highlight"><span>{children}</span><span className="paint-overlay" aria-hidden="true">{children}</span></mark>;}
