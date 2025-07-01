import { useMutation, useApolloClient } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LOGOUT_MUTATION } from "../graphql/mutation";
import { removeToken } from "../utils/helpers";

export const useLogout = () => {
  const navigate = useNavigate();
  const client = useApolloClient();

  const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
    onCompleted: async () => {
      await client.resetStore();
      removeToken();
      navigate("/login");
    },
    onError: (error) => {
      console.error("Error logging out:", error);
    },
  });

  const logout = async () => {
    await logoutMutation();
  };

  return logout;
};
