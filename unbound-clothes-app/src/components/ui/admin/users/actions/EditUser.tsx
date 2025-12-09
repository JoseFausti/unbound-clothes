import { Close } from '@mui/icons-material'
import Styles from './EditUser.module.css'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useState } from 'react'
import axiosInstance from '../../../../../config/axios'
import type { ICloudinaryUpload, IUser, UserRole } from '../../../../../types/schemas.db'
import { errorBanner, isSuperAdmin, successBanner } from '../../../../../utils/functions'
import Loader from '../../../loader/Loader'
import { createEditUserSchema, type CreateEditUserValues } from '../../../../../types/schemas.zod'
import useAuth from '../../../../../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import useImage from '../../../../../hooks/useImagePreview'
import { useAppDispatch } from '../../../../../hooks/redux'
import { updateUsers } from '../../../../../store/slices/userSlice'

interface EditUserProps {
  user: Omit<IUser, "password">;
  closeModal: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ user, closeModal }) => {
  const { user: authUser, loading } = useAuth();
  const dispatch = useAppDispatch();
  
  const [, setLoadingSubmit] = useState(false)
  const { file, preview, error, handleImageChange, reset } = useImage();

  if (loading) return <Loader />
  if (!loading && !authUser) return <Navigate to="/" replace />

  const initialValues: CreateEditUserValues = {
    name: user.name,
    email: user.email,
    password: '',
    role: user.role
  }

  const handleSubmit = async (values: CreateEditUserValues) => {
    setLoadingSubmit(true)
    try {
         const userDTO: { 
            name: string; 
            email: string; 
            imageUrl?: string; 
            password: string; 
            role: UserRole;
        } = { ...values }

        if (!userDTO.name.trim() || !userDTO.email.trim() || !userDTO.password.trim()) return

        if (file) {
            // Delete previous image
            try {
                await axiosInstance.request({
                    method: "DELETE",
                    url: "/upload/cloudinary",
                    data: { imageUrl: user.imageUrl },
                });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error){/*Empty*/}

            const formData = new FormData()
            formData.append('file', file)
            const { data } = await axiosInstance.post<ICloudinaryUpload>('/upload/cloudinary', formData)
            userDTO.imageUrl = data.url
        }

        if (userDTO.role !== user.role) {
            await axiosInstance.put(`/users/admin/${user.id}/role`, { role: userDTO.role })
            .then(async () => {
                const endpoint = 
                    userDTO.role === "SELLER"
                        ? `/users/seller/${user.id}`
                    :userDTO.role === "ADMIN"
                        ? `/users/admin/${user.id}` 
                    :`/users/${user.id}`;
                
                await axiosInstance.put<IUser>(endpoint, {
                    ...user, 
                    name: userDTO.name, 
                    email: userDTO.email, 
                    imageUrl: userDTO.imageUrl,
                    password: userDTO.password
                }).then((res) => {
                    dispatch(updateUsers(res.data));
                    successBanner();
                    closeModal();
                }); 
            });
        } else {
            const endpoint = 
                user.role === "SELLER"
                    ? `/users/seller/${user.id}`
                :user.role === "ADMIN"
                    ? `/users/admin/${user.id}` 
                :`/users/${user.id}`;
            
            await axiosInstance.put<IUser>(endpoint, {
                ...user, 
                name: userDTO.name, 
                email: userDTO.email, 
                imageUrl: userDTO.imageUrl,
                password: userDTO.password
            }).then((res) => {
                dispatch(updateUsers(res.data));
                successBanner();
                closeModal();
            });
        }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      errorBanner()
    } finally {
      setLoadingSubmit(false)
    }
  }

  const availableRoles = isSuperAdmin(authUser!.role)
    ? ['USER', 'SELLER', 'ADMIN']
    : ['USER', 'SELLER']

  return (
    <>
      <div className={Styles.editPersonalInfoContainer}>
        <div className={Styles.editPersonalInfoHeader}>
          <h3 className={Styles.editPersonalInfoTitle}>Edit User</h3>
          <Close
            className={Styles.editPersonalInfoCloseButton}
            onClick={closeModal}
          />
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(createEditUserSchema)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className={Styles.editPersonalInfoForm}>
              <div className={Styles.editPersonalInfoInput}>
                <label htmlFor="userName" className={Styles.editPersonalInfoLabel}>
                  Name:
                </label>
                <Field
                  type="text"
                  id="userName"
                  name="name"
                  className={Styles.editPersonalInfoInputField}
                />
                <ErrorMessage name="name" component="p" className={Styles.error} />
              </div>

              <div className={Styles.editPersonalInfoInput}>
                <label htmlFor="userEmail" className={Styles.editPersonalInfoLabel}>
                  Email:
                </label>
                <Field
                  type="email"
                  id="userEmail"
                  name="email"
                  className={Styles.editPersonalInfoInputField}
                />
                <ErrorMessage name="email" component="p" className={Styles.error} />
              </div>

                <div className={Styles.editPersonalInfoInput}>
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

              <div className={Styles.editPersonalInfoInput}>
                  <label
                    htmlFor="userPassword"
                    className={Styles.editPersonalInfoLabel}
                  >
                    Password:
                  </label>
                  <Field
                    type="password"
                    id="userPassword"
                    name="password"
                    className={Styles.editPersonalInfoInputField}
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className={Styles.error}
                  />
                </div>

              <div className={Styles.editPersonalInfoInput}>
                <label htmlFor="userRole" className={Styles.editPersonalInfoLabel}>
                  Role:
                </label>
                <Field
                  as="select"
                  id="userRole"
                  name="role"
                  className={Styles.editPersonalInfoInputField}
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="role" component="p" className={Styles.error} />
              </div>

              <div className={Styles.editPersonalInfoButtonContainer}>
                <button
                  type="submit"
                  className={Styles.editPersonalInfoButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default EditUser
