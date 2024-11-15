// src/components/ToastNotification.js
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000} // Toast will auto-close in 3 seconds
      hideProgressBar={false} // Show the progress bar
      pauseOnHover={true} // Pause progress on hover
      draggable={true} // Allow drag to dismiss
    />
  );
};

// Helper function to trigger different types of toasts
export const showToast = (type, message) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast.info(message);
      break;
    case "warning":
      toast.warn(message);
      break;
    default:
      toast(message);
  }
};

export default ToastNotification;
