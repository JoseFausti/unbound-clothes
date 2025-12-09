import { Provider } from "react-redux"
import { store } from "../store/store"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { googleConfig } from "../config/config"
import { ThemeProvider } from "../context/ThemeContext"
import { AuthProvider } from "../context/AuthContext"

const Providers = ({children}: {children: React.ReactNode}) => {
  const { googleClientId } = googleConfig;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
        <Provider store={store}>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </Provider>
    </GoogleOAuthProvider>
  )
}

export default Providers
