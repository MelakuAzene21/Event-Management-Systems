import React, { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center text-gray-500 text-lg py-12">
                    Something went wrong. Please refresh the page or try again later.
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;