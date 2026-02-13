import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Star, 
  User, 
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { useHelperStore } from "../../store/helperStore";
import { useBookingStore } from "../../store/bookingStore";
import toast from "react-hot-toast";

const HelpersPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const helperStore = useHelperStore();
  const bookingStore = useBookingStore();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingHelper, setBookingHelper] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await helperStore.fetchHelpersByCategory(category);
      } catch (error) {
        toast.error("Failed to load helpers");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const handleBook = async (helperId) => {
    setBookingHelper(helperId);
    try {
      await bookingStore.createBooking({ helperId, category });
      toast.success("Booking created successfully!");
      navigate("/user/booking-history");
    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setBookingHelper(null);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-warning text-warning" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-warning/50 text-warning" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-base-300" />
        );
      }
    }
    return stars;
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      "plumbing": "🔧",
      "electrician": "⚡",
      "cooking": "👨‍🍳",
      "car cleaning": "🚗",
      "house cleaning": "🏠",
      "gardening": "🌱"
    };
    return icons[cat] || "🛠️";
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back Button & Header */}
      <div>
        <button 
          className="btn btn-ghost gap-2 mb-4"
          onClick={() => navigate("/user/categories")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">{getCategoryIcon(category)}</span>
              <span className="capitalize">{category} Helpers</span>
            </h1>
            <p className="text-base-content/60 mt-1">Choose a helper to book your service</p>
          </div>
          <div className="badge badge-lg badge-primary gap-2">
            {helperStore.helpers.length} Available
          </div>
        </div>
      </div>

      {/* Helpers List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/60 mt-4">Loading helpers...</p>
        </div>
      ) : helperStore.helpers.length === 0 ? (
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-base-content/20 mb-3" />
            <p className="text-lg font-semibold text-base-content/60">
              No helpers available
            </p>
            <p className="text-sm text-base-content/40">
              Try checking back later or choose a different category
            </p>
            <button 
              className="btn btn-primary mt-4"
              onClick={() => navigate("/user/categories")}
            >
              Browse Categories
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {helperStore.helpers.map((h) => (
            <div
              key={h._id}
              className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="card-body p-4 sm:p-6">
                {/* Helper Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12 h-12 sm:w-14 sm:h-14 ring ring-primary ring-offset-base-100 ring-offset-2">
                        <span className="text-lg sm:text-xl font-bold">
                          {h.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold">{h.name}</h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          {renderStars(h.averageRating || 0)}
                        </div>
                        <span className="text-xs font-semibold text-base-content/70">
                          {h.averageRating ? h.averageRating.toFixed(1) : "New"}
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="badge badge-outline badge-sm gap-1">
                          <User className="w-3 h-3" />
                          Helper
                        </div>
                        <div className="badge badge-success badge-outline badge-sm gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    className="btn btn-primary btn-sm gap-2 flex-shrink-0"
                    onClick={() => handleBook(h._id)}
                    disabled={bookingHelper === h._id}
                  >
                    {bookingHelper === h._id ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        <span className="hidden sm:inline">Booking...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span className="hidden sm:inline">Book Now</span>
                        <span className="sm:hidden">Book</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      {!isLoading && helperStore.helpers.length > 0 && (
        <div className="card bg-gradient-to-r from-info/10 to-primary/10 border border-info/20">
          <div className="card-body p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-info/20 rounded-lg flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-info" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">All helpers are verified</h3>
                <p className="text-sm text-base-content/70">
                  Every helper has been verified and background-checked. You can book with confidence knowing you're getting quality service.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpersPage;