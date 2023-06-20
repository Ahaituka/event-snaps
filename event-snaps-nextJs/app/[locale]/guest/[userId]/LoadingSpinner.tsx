// LoadingSpinner.tsx

interface LoadingSpinnerProps {
    isLoading: boolean;
  }
  
  const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
    return (
      isLoading && <div className="loader">Completing the task...</div>
    );
  };
  
  export default LoadingSpinner;
  