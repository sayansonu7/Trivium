interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const containerClasses = fullScreen
    ? "min-h-screen gradient-bg flex items-center justify-center"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <div className="text-center animate-fade-in">
        <div
          className={`spinner ${sizeClasses[size]} mx-auto mb-4 glow-cyan`}
        ></div>
        {text && (
          <div className="space-y-2">
            <p className="text-gray-300 font-medium">{text}</p>
            {/* Loading dots animation */}
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
