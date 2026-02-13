import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useRatingStore } from "../store/ratingStore";
import toast from "react-hot-toast";

const RatingBox = ({ bookingId }) => {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitRating } = useRatingStore();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitRating({ bookingId, rating });
      toast.success("Rating submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (value) => {
    switch (value) {
      case 5:
        return "Excellent";
      case 4:
        return "Good";
      case 3:
        return "Average";
      case 2:
        return "Poor";
      case 1:
        return "Very Poor";
      default:
        return "";
    }
  };

  return (
    <div className="mt-2 pt-4 border-t border-base-300">
      <div className="space-y-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-warning" />
          <span className="font-semibold text-sm sm:text-base">Rate this service</span>
        </div>

        {/* Star Rating Display */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="btn btn-ghost btn-sm p-1 hover:scale-110 transition-transform duration-200"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-200 ${
                    star <= (hoveredRating || rating)
                      ? "fill-warning text-warning"
                      : "text-base-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Rating Text */}
          <div className="flex items-center gap-2">
            <div className="badge badge-lg badge-warning gap-2 font-semibold">
              {rating}
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-sm font-medium text-base-content/70">
              {getRatingText(rating)}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="btn btn-primary btn-sm sm:btn-md gap-2 w-full sm:w-auto"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Rating
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RatingBox;