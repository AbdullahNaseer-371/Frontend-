import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Error Boundary:", error);
        console.error("Error Info:", errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page">
                    <h1>Something went wrong.</h1>

                    <p>
                        Please refresh the page and try again.
                    </p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Refresh
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;