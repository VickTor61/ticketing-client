import { useQuery } from "@apollo/client";
import { CURRENT_USER_QUERY } from "../graphql/query";
import { useNavigate } from "react-router-dom";

import Portal from "./portal";
import { Loader } from "lucide-react";
import { useLogout } from "../hooks/useLogout";
import { removeToken } from "../utils/helpers";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useLogout();

  const { data, loading } = useQuery(CURRENT_USER_QUERY, {
    onCompleted: (data) => {
      if (!data?.me) {
        navigate("/login");
      }
    },
    onError: (error) => {
      removeToken();
      navigate("/login");
      console.error("Error fetching current user:", error);
    },
  });

  return !data?.me || loading ? (
    <Loader />
  ) : (
    <div>
      <div className="flex items-center bg-white shadow-sm border-b border-gray-100 w-full py-2.5 px-4">
        <h1 className="text-lg font-semibold text-gray-800 capitalize">
          {data.me.role} Dashboard
        </h1>

        <div className="flex items-center ml-auto space-x-4">
          <p className="text-sm font-medium">
            {" "}
            Welcome{" "}
            <span className="text-blue-700">
              {data.me.firstName} {data.me.lastName}
            </span>
          </p>

          <button
            className="px-2 py-1 text-sm font-medium text-white bg-red-600 border border-gray-200 rounded-md shadow-sm cursor-pointer"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      <Portal currentUser={data.me} />
    </div>
  );
}
