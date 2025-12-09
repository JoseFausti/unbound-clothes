import { Link } from 'react-router-dom'
import Styles from './AuthForm.module.css'
import axiosInstance from '../../../config/axios'
import { Google } from '@mui/icons-material'
import { errorBanner, wrongUserBanner } from '../../../utils/functions'
import { useGoogleLogin } from '@react-oauth/google'
import useAuth from '../../../hooks/useAuth'
import Loader from '../loader/Loader'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useState } from 'react'
import { loginSchema, type LoginValues } from '../../../types/schemas.zod'

const LoginForm = () => {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const initialValues: LoginValues = {
    email: '',
    password: ''
  }

  const handleSubmit = async (values: LoginValues) => {
    setLoading(true)
    await axiosInstance.post<{ token: string }>('/auth/login', values)
      .then(res => {
        setLoading(false)
        login(res.data.token)
      })
      .catch(async () => {
        setLoading(false)
        await wrongUserBanner()
      })
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await axiosInstance.post<{ token: string }>('/auth/login/google', {
        access_token: tokenResponse.access_token
      })
        .then(res => {
          login(res.data.token)
          setLoading(false)
        })
        .catch(async () => {
          await errorBanner()
          setLoading(false)
        })
     
    },
    onError: async () => {
      await errorBanner()
    }
  })

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={Styles.loginFormContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(loginSchema)}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className={Styles.loginForm}>
                <h2 className={Styles.formTitle}>Sign In</h2>

                <div className={Styles.inputSection}>
                  <label htmlFor="email" className={Styles.inputLabel}>Email:</label>
                  <Field className={Styles.input} type="email" id="email" name="email" />
                  <ErrorMessage name="email" component="p" className={Styles.error} />
                </div>

                <div className={Styles.inputSection}>
                  <label htmlFor="password" className={Styles.inputLabel}>Password:</label>
                  <Field className={Styles.input} type="password" id="password" name="password" />
                  <ErrorMessage name="password" component="p" className={Styles.error} />
                </div>

                <div className={Styles.buttonSection}>
                  <button className={Styles.loginButton} type="submit">Sign In</button>
                  <button
                    className={Styles.googleButton}
                    type="button"
                    onClick={() => googleLogin()}
                  >
                    <Google /> Sign In with Google
                  </button>
                </div>

                <p>
                  Don’t have an account?{' '}
                  <Link to="/register" className={Styles.link}>
                    Sign Up
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  )
}

export default LoginForm
