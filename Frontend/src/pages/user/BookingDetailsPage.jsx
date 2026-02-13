import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  Star,
  Calendar
} from "lucide-react";
import api from "../../lib/axios";
import { getSocket } from "../../socket";
import SupportChat from "../../components/SupportChat";
import RatingBox from "../../components/RatingBox";
import Timer from "../../components/Timer";
import toast from "react-hot-toast";

const UserBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = getSocket();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/bookings/${id}`);
      setBooking(res.data.booking);
    } catch (error) {
      console.error(error.response?.data);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();

    // Join booking room
    socket.emit("joinBookingRoom", id);

    // Listen for live booking updates
    socket.on("bookingUpdated", (updatedBooking) => {
      if (updatedBooking._id === id) {
        setBooking(updatedBooking);
        toast.success("Booking updated!");
      }
    });

    return () => {
      socket.off("bookingUpdated");
    };

  }, [id]);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await api.put(`/bookings/complete/${id}`);
      toast.success("Booking marked as complete!");
    } catch (error) {
      console.error(error.response?.data);
      toast.error("Failed to complete booking");
    } finally {
      setIsCompleting(false);
    }
  };

  const getStatusConfig = () => {
    switch (booking?.status) {
      case "waiting":
        return {
          icon: <Clock className="w-6 h-6" />,
          color: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/30",
          badgeClass: "badge-warning"
        };
      case "accepted":
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: "text-info",
          bgColor: "bg-info/10",
          borderColor: "border-info/30",
          badgeClass: "badge-info"
        };
      case "reached":
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          color: "text-secondary",
          bgColor: "bg-secondary/10",
          borderColor: "border-secondary/30",
          badgeClass: "badge-secondary"
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-6 h-6" />,
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/30",
          badgeClass: "badge-success"
        };
      default:
        return {
          icon: <Briefcase className="w-6 h-6" />,
          color: "text-base-content",
          bgColor: "bg-base-200",
          borderColor: "border-base-300",
          badgeClass: "badge-ghost"
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-base-content/60 mt-4">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-16 h-16 text-error mb-4" />
        <p className="text-xl font-semibold text-error">Booking not found</p>
        <button 
          className="btn btn-primary mt-4"
          onClick={() => navigate("/user")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const statusConfig = getStatusConfig();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button */}
      <button 
        className="btn btn-ghost gap-2 mb-4"
        onClick={() => navigate("/user")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Booking Details Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-300">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold capitalize">
                {booking.category} Service
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-base-content/60">
                <Calendar className="w-4 h-4" />
                Booked on {new Date(booking.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className={`badge ${statusConfig.badgeClass} gap-2 px-4 py-3 text-sm font-semibold`}>
              {statusConfig.icon}
              <span className="capitalize">{booking.status}</span>
            </div>
          </div>

          {/* Status Section */}
          <div className={`p-4 sm:p-6 rounded-xl ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${statusConfig.color}`}>
                {statusConfig.icon}
              </div>
              <div>
                <div className="font-semibold">Booking Status</div>
                <div className="text-sm text-base-content/60 capitalize">{booking.status}</div>
              </div>
            </div>

            {/* Helper Info */}
            {booking.helper && (
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg mt-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                    <span className="text-lg font-bold">
                      {booking.helper.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-base-content/60">Helper Assigned</div>
                  <div className="font-semibold">{booking.helper.name}</div>
                </div>
              </div>
            )}

            {/* Timer */}
            {booking.status === "accepted" && booking.arrivalTime && (
              <div className="mt-4 p-4 bg-base-100 rounded-lg">
                <Timer arrivalTime={booking.arrivalTime} />
              </div>
            )}

            {/* Complete Button */}
            {booking.status === "reached" && (
              <button
                className="btn btn-success w-full mt-4 gap-2"
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
                    <CheckCircle className="w-5 h-5" />
                    Mark as Complete
                  </>
                )}
              </button>
            )}
          </div>

          {/* Rating Section */}
          {booking.status === "completed" && (
            <div className="pt-4 border-t border-base-300">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-warning" />
                <h3 className="font-semibold text-lg">Rate this service</h3>
              </div>
              <RatingBox bookingId={booking._id} />
            </div>
          )}
        </div>
      </div>

      {/* Support Chat Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold">Support Chat</h2>
        </div>
        <SupportChat bookingId={booking._id} />
      </div>
    </div>
  );
};

export default UserBookingDetails;