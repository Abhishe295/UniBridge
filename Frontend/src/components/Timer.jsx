import { useEffect, useState } from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

const Timer = ({ arrivalTime }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isDelayed, setIsDelayed] = useState(false);
  const [isAlmostThere, setIsAlmostThere] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const arrival = new Date(arrivalTime);
      const diff = arrival - now;

      if (diff <= 0) {
        const delay = Math.abs(diff);
        const mins = Math.floor(delay / 60000);
        const secs = Math.floor((delay % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
        setIsDelayed(true);
        setIsAlmostThere(false);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
        setIsDelayed(false);
        setIsAlmostThere(mins < 5);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [arrivalTime]);

  const getStatusConfig = () => {
    if (isDelayed) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        badgeClass: "badge-error",
        label: "Delayed by",
        iconColor: "text-error"
      };
    }
    if (isAlmostThere) {
      return {
        icon: <CheckCircle className="w-5 h-5" />,
        badgeClass: "badge-warning",
        label: "Almost there",
        iconColor: "text-warning"
      };
    }
    return {
      icon: <Clock className="w-5 h-5" />,
      badgeClass: "badge-info",
      label: "Arriving in",
      iconColor: "text-info"
    };
  };

  const config = getStatusConfig();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className={`flex items-center gap-2 ${config.iconColor}`}>
        {config.icon}
        <span className="text-sm font-medium">{config.label}</span>
      </div>
      
      <div className={`badge ${config.badgeClass} gap-2 px-4 py-3 text-base font-bold`}>
        <Clock className="w-4 h-4" />
        {timeLeft}
      </div>
    </div>
  );
};

export default Timer;