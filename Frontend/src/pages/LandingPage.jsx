import { Link } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Clock,
  Shield,
  Zap,
  Wrench,
  ChefHat,
  Car,
  Home,
  Leaf
} from "lucide-react";

const LandingPage = () => {
  const services = [
    { name: "Plumbing", icon: Wrench },
    { name: "Electrician", icon: Zap },
    { name: "Cooking", icon: ChefHat },
    { name: "Car Cleaning", icon: Car },
    { name: "House Cleaning", icon: Home },
    { name: "Gardening", icon: Leaf }
  ];

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: "Instant Booking", desc: "Book services in seconds" },
    { icon: <Star className="w-6 h-6" />, title: "Verified Helpers", desc: "All helpers are background-checked" },
    { icon: <Clock className="w-6 h-6" />, title: "Real-time Tracking", desc: "Track your helper's arrival" },
    { icon: <Shield className="w-6 h-6" />, title: "Secure Platform", desc: "Your data is safe with us" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .service-icon-container {
          animation: float 3s ease-in-out infinite;
        }
        .service-icon-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="flex flex-col items-center justify-center text-center gap-6 sm:gap-8 animate-fadeIn">
         

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight max-w-4xl">
            Book Trusted Helpers Instantly
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg lg:text-xl text-base-content/70 max-w-2xl px-4">
            Plumbing, Electricians, Cleaning, Gardening and more.
            Real-time booking. Ratings. Secure dashboard.
          </p>

          {/* CTA Button */}
          <Link to="/login" className="btn btn-primary btn-lg gap-2 mt-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Available Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300 overflow-hidden group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-body p-4 sm:p-6 items-center text-center">
                    <div className="service-icon-container relative mb-3">
                      {/* Glow effect background */}
                      <div 
                        className="absolute inset-0 bg-primary opacity-20 blur-xl rounded-full service-icon-glow group-hover:opacity-40 transition-opacity duration-300"
                      />
                      
                      {/* Icon container */}
                      <div className="relative bg-primary p-4 sm:p-5 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.5] relative z-10" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base">{service.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Why Choose HelperHub?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:-translate-y-1"
              >
                <div className="card-body p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-base-content/60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;