{/* Buttons réutilisable*/}
import React from 'react';

interface ButtonProps {
    label: string;
    onClick: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
}) => {
    const baseStyles = 'px-4 py-2 rounded-lg focus:outline-none focus:ring transition duration-300';
    const variants = {
        primary: 'bg-primary text-white hover:bg-opacity-90 focus:ring-primary',
        secondary: 'bg-gray-200 text-dark hover:bg-gray-300 focus:ring-gray-300',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {label}
        </button>
    );
};

export default Button;
