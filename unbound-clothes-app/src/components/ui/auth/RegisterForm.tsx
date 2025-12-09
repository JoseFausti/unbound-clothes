import Styles from './AuthForm.module.css'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import axiosInstance from '../../../config/axios'
import { errorBanner } from '../../../utils/functions'
import useImage from '../../../hooks/useImagePreview'
import type { ICloudinaryUpload } from '../../../types/schemas.db'
import useAuth from '../../../hooks/useAuth'
import Loader from '../loader/Loader'
import { useState } from 'react'
import { registerSchema, type RegisterFormValues } from '../../../types/schemas.zod'

const RegisterForm = () => {
  const { file, preview, error, handleImageChange, reset } = useImage()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
  }

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true)
    const userDTO: { name: string; email: string; password: string; imageUrl?: string } = { ...values }

    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await axiosInstance.post<ICloudinaryUpload>('/upload/cloudinary', formData)
      userDTO.imageUrl = data.url
    }

    await axiosInstance.post<{ token: string }>('/auth/register', userDTO)
      .then(res => {
        login(res.data.token)
        setLoading(false)
      })
      .catch(async () => {
        await errorBanner()
        setLoading(false)
      })
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={Styles.loginFormContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={toFormikValidationSchema(registerSchema)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className={Styles.loginForm}>
                <h2 className={Styles.formTitle}>Sign Up</h2>

                {/* Name */}
                <div className={Styles.inputSection}>
                  <label htmlFor="name" className={Styles.inputLabel}>Name:</label>
                  <Field className={Styles.input} type="text" id="name" name="name" />
                  <ErrorMessage name="name" component="p" className={Styles.error} />
                </div>

                {/* Email */}
                <div className={Styles.inputSection}>
                  <label htmlFor="email" className={Styles.inputLabel}>Email:</label>
                  <Field className={Styles.input} type="email" id="email" name="email" />
                  <ErrorMessage name="email" component="p" className={Styles.error} />
                </div>

                {/* Image Upload */}
                <div className={Styles.inputSection}>
                  <label htmlFor="imageUrl" className={Styles.inputFileLabel}>User Image:</label>
                  {preview ? (
                    <div className={Styles.previewContainer}>
                      <img src={preview} alt="Preview" className={Styles.previewImage} />
                      <button type="button" className={Styles.resetButton} onClick={reset}>Reset</button>
                    </div>
                  ) : (
                    <input
                      className={Styles.inputFile}
                      type="file"
                      id="imageUrl"
                      name="imageUrl"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  )}
                  {error && <p className={Styles.error}>{error}</p>}
                </div>

                {/* Password */}
                <div className={Styles.inputSection}>
                  <label htmlFor="password" className={Styles.inputLabel}>Password:</label>
                  <Field className={Styles.input} type="password" id="password" name="password" />
                  <ErrorMessage name="password" component="p" className={Styles.error} />
                </div>

                {/* Submit */}
                <div className={Styles.buttonSection}>
                  <button className={Styles.loginButton} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>

                <p>
                  Already have an account?{" "}
                  <Link to="/login" className={Styles.link}>
                    Sign In
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

export default RegisterForm
