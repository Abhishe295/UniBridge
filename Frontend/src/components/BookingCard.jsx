import { Clock, CheckCircle, UserCheck, Star, AlertCircle } from "lucide-react";
import Timer from "./Timer";
import { useAuthStore } from "../store/authStores";
import { useBookingStore } from "../store/bookingStore";
import RatingBox from "./RatingBox";
import { useState } from "react";
import toast from "react-hot-toast";

const BookingCard = ({ booking }) => {
  const { user } = useAuthStore();
  const { acceptBooking, completeBooking } = useBookingStore();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptBooking(booking._id);
      toast.success("Booking accepted successfully!");
    } catch (error) {
      toast.error("Failed to accept booking");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeBooking(booking._id);
      toast.success("Booking marked as complete!");
    } catch (error) {
      toast.error("Failed to complete booking");
    } finally {
      setIsCompleting(false);
    }
  };

  const getStatusConfig = () => {
    switch (booking.status) {
      case "waiting":
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "badge-warning",
          text: "Waiting",
        };
      case "accepted":
        return {
          icon: <UserCheck className="w-5 h-5" />,
          color: "badge-info",
          text: "Accepted",
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: "badge-success",
          text: "Completed",
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: "badge-ghost",
          text: booking.status,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
      <div className="card-body p-4 sm:p-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`badge ${statusConfig.color} gap-2 px-3 py-3 text-sm font-semibold`}>
            {statusConfig.icon}
            <span className="hidden sm:inline">{statusConfig.text}</span>
          </div>
        </div>

        {/* Timer Section */}
        {booking.status === "accepted" && booking.arrivalTime && (
          <div className="bg-base-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Time Remaining</span>
            </div>
            <Timer arrivalTime={booking.arrivalTime} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {user.role === "helper" && booking.status === "waiting" && (
            <button
              className="btn btn-primary gap-2 flex-1"
              onClick={handleAccept}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Accepting...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Accept Booking
                </>
              )}
            </button>
          )}

          {user.role === "user" && booking.status === "accepted" && (
            <button
              className="btn btn-success gap-2 flex-1"
              onClick={handleComplete}
              disabled={isCompleting}
            >
              {isCompleting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Mark as Complete
                </>
              )}
            </button>
          )}
        </div>

        {/* Rating Section */}
        {booking.status === "completed" && (
          <div className="mt-4 pt-4 border-t border-base-300">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-warning fill-warning" />
              <span className="font-semibold text-sm">Rate this service</span>
            </div>
            <RatingBox bookingId={booking._id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;