import { useAuthStore } from "../../store/authStores";
import SupportChat from "../../components/SupportChat";

const HelperSupport = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Support</h1>
      <div>
        Please open a booking to chat with the user.
      </div>
    </div>
  );
};

export default HelperSupport;

