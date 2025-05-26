---
applyTo: "**"
---

Coding Instructions
These instructions outline the coding standards, file structure, and best practices to follow when working on a project using React, TypeScript, Tailwind CSS, and Shadcn UI. The goal is to ensure consistency, maintainability, and adherence to modern development practices.

File Structure
Organize the project files within the src/ directory as follows:

src/: Contains all source code.
components/: Reusable UI components.
ui/: Shadcn UI components or wrappers around them.

pages/: Components representing different pages or routes.
hooks/: Custom React hooks.
utils/: Utility functions.
types/: Shared TypeScript type definitions.
styles/: Global styles or Tailwind CSS configuration files.
App.tsx: Main application component.
index.tsx: Entry point of the application.

Example Structure
src/
├── components/
│ ├── ui/
│ │ ├── Button.tsx
│ │ └── Card.tsx
│ └── Navbar.tsx
├── pages/
│ └── Home.tsx
├── hooks/
│ └── useAuth.ts
├── utils/
│ └── formatDate.ts
├── types/
│ └── user.ts
├── styles/
│ └── globals.css
├── App.tsx
└── index.tsx

Coding Standards

Use TypeScript for all code.
Define types for props, state, and variables where applicable.
Use functional components with React hooks (no class components unless explicitly required).
Apply Tailwind CSS utility classes directly in JSX for styling.
Utilize Shadcn UI components where appropriate, following their official documentation.
Write clean, readable, and maintainable code adhering to best practices for each technology.

Specific Rules

1. Naming Conventions

Component Files: Use PascalCase (e.g., MyComponent.tsx).
Other Files: Use camelCase or kebab-case (e.g., utils.ts, my-utils.ts).
Variables and Functions: Use camelCase (e.g., fetchData).
Constants: Use UPPER_CASE (e.g., API_URL).

2. Component Guidelines

Place each component in its own file.
Export the component as the default export.
Use arrow functions for component definitions.
Define prop types using TypeScript interfaces.

Example:
interface ButtonProps {
label: string;
onClick: () => void;
}

const Button = ({ label, onClick }: ButtonProps) => {
return (
<button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={onClick}>
{label}
</button>
);
};

export default Button;

3. TypeScript Best Practices

Use interface for object types (e.g., props).
Use type aliases for union types or complex types.
Prefer type inference where possible, but be explicit when clarity is needed.
Avoid using the any type.

Example:
interface User {
id: number;
name: string;
}

type Status = 'active' | 'inactive';

4. Styling with Tailwind CSS

Use Tailwind utility classes directly in JSX.
Avoid inline styles or custom CSS unless absolutely necessary.
Use the clsx library for conditional class names.

Example:
import clsx from 'clsx';

interface CardProps {
title: string;
isActive?: boolean;
}

const Card = ({ title, isActive }: CardProps) => {
return (

<div
className={clsx(
'p-4 rounded-lg shadow-md',
isActive ? 'bg-green-100' : 'bg-gray-100'
)} >
<h2 className="text-lg font-semibold">{title}</h2>
</div>
);
};

export default Card;

5. Using Shadcn UI

Import Shadcn UI components from components/ui/.
Follow the component’s prop types and usage guidelines from the Shadcn UI documentation.

Example:
import { Button } from '@/components/ui/button';

const SubmitButton = () => {
return <Button variant="default">Submit</Button>;
};

export default SubmitButton;

6. Hooks

Create custom hooks for reusable logic.
Keep hooks focused on a single responsibility.

Example:
import { useState, useEffect } from 'react';

export const useWindowWidth = () => {
const [width, setWidth] = useState(window.innerWidth);

useEffect(() => {
const handleResize = () => setWidth(window.innerWidth);
window.addEventListener('resize', handleResize);
return () => window.removeEventListener('resize', handleResize);
}, []);

return width;
};

7. State Management

Use useState for simple state management.
Use useReducer for complex state logic.
Consider React Context or a state management library (e.g., Redux) for global state if needed.

Example:
const Counter = () => {
const [count, setCount] = useState(0);

return (

<div>
<p className="text-xl">{count}</p>
<button className="px-2 py-1 bg-blue-500 text-white" onClick={() => setCount(count + 1)}>
Increment
</button>
</div>
);
};

export default Counter;

8. Performance Optimization

Use useMemo and useCallback to prevent unnecessary re-renders.
Avoid inline functions in JSX where performance is a concern.

Example:
import { useCallback } from 'react';

const List = ({ items }: { items: string[] }) => {
const renderItem = useCallback((item: string) => <li key={item}>{item}</li>, []);

return <ul>{items.map(renderItem)}</ul>;
};

export default List;

9. Accessibility

Use semantic HTML elements (e.g., <button>, <nav>).
Add ARIA attributes when necessary (e.g., aria-label).
Ensure keyboard navigation is supported.

Example:
const Nav = () => {
return (

<nav aria-label="Main navigation">
<ul className="flex space-x-4">
<li><a href="/" className="text-blue-500">Home</a></li>
<li><a href="/about" className="text-blue-500">About</a></li>
</ul>
</nav>
);
};

export default Nav;

10. Code Quality

Write clean, readable code with meaningful variable and function names.
Keep functions small and focused on a single task.
Avoid deeply nested code structures.
