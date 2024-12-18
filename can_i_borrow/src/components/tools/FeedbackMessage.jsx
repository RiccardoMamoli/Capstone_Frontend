const FeedbackMessage = ({ message, type }) => {
    if (!message) return null;

    return (
        <div
            className={`feedback-message ${type}`}
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                padding: "10px 20px",
                borderRadius: "8px",
                color: type === "success" ? "green" : "red",
                backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 1000,
            }}
        >
            {message}
        </div>
    );
};

export default FeedbackMessage;