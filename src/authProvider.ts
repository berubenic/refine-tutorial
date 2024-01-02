import type { AuthBindings } from "@refinedev/core";
import { axiosInstance } from "@refinedev/simple-rest";

const mockUsers = [
  { email: "john@mail.com", roles: ["admin"], token: "123" },
  { email: "jane@mail.com", roles: ["editor"], token: "321" },
];

const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    // Suppose we actually send a request to the back end here.
    const user = mockUsers.find((item) => item.email === email);

    if (user) {
      localStorage.setItem("auth", JSON.stringify(user));
      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${user.token}`,
      };
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        message: "Login Error",
        name: "Invalid email or password",
      },
    };
  },
  check: async () => {
    const user = localStorage.getItem("auth");

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        message: "Check failed",
        name: "Unauthorized",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem("auth");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return {};
  },
  getPermissions: () => {
    const user = localStorage.getItem("auth");

    if (user) {
      const { roles } = JSON.parse(user);

      return roles;
    }

    return null;
  },
  getIdentity: async () => {
    const user = localStorage.getItem("auth");

    if (user) {
      const { email, roles } = JSON.parse(user);

      return { email, roles };
    }

    return null;
  },
  register: async ({ email }) => {
    const user = mockUsers.find((user) => user.email === email);

    if (user) {
      return {
        success: false,
        error: {
          name: "Register Error",
          message: "User already exists",
        },
      };
    }

    mockUsers.push({ email, roles: [], token: "" });

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  forgotPassword: async ({ email }) => {
    // send password reset link to the user's email address here

    // if request is successful
    return {
      success: true,
      redirectTo: "/login",
    };

    // if request is not successful
    return {
      success: false,
      error: {
        name: "Forgot Password Error",
        message: "Email address does not exist",
      },
    };
  },
  updatePassword: async ({ password }) => {
    // update the user's password here

    // if request is successful
    return {
      success: true,
      redirectTo: "/login",
    };

    // if request is not successful
    return {
      success: false,
      error: {
        name: "Forgot Password Error",
        message: "Email address does not exist",
      },
    };
  },
};

export default authProvider;
