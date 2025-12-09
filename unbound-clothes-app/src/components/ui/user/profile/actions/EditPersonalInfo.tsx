import { Close } from '@mui/icons-material'
import Styles from './EditPersonalInfo.module.css'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux'
import { personalInfoSchema, type PersonalInfoValues } from '../../../../../types/schemas.zod'
import axiosInstance from '../../../../../config/axios'
import type { IUser } from '../../../../../types/schemas.db'
import { updateUser } from '../../../../../store/slices/userSlice'
import { errorBanner, successBanner } from '../../../../../utils/functions'
import Loader from '../../../loader/Loader'

interface EditPersonalInfoProps {
    closeModal: () => void
}

const EditPersonalInfo = ({ closeModal }: EditPersonalInfoProps) => {

    const {user} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    const initialValues: PersonalInfoValues = {
        name: user?.name || '',
        email: user?.email || '',
        password: ''
    }

    const handleSubmit = async (values: PersonalInfoValues) => {
        setLoading(true);
        try {
            if (!user) return;
            const { name, email, password } = values;
            if (!name.trim() || !email.trim() || !password.trim()) return;

            const endpoint = 
                user.role === "SELLER"
                    ? `/users/seller/${user.id}`
                : user.role === "ADMIN"
                    ? `/users/admin/${user.id}` 
                :`/users/${user.id}`;

            const { data } = await axiosInstance.put<IUser>(endpoint, { name, email, password });

            if (data) {
                dispatch(updateUser({
                    ...user,
                    name: data.name,
                    email: data.email
                }));
                successBanner();
                closeModal();
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            errorBanner();
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {loading 
            ? <Loader />
            : 
            <>
                <div className={Styles.editPersonalInfoContainer}>
                    <div className={Styles.editPersonalInfoHeader}> 
                        <h3 className={Styles.editPersonalInfoTitle}>Edit Personal Info</h3>
                        <Close className={Styles.editPersonalInfoCloseButton} onClick={closeModal} />
                    </div>

                    <Formik
                    initialValues={initialValues}
                    validationSchema={toFormikValidationSchema(personalInfoSchema)}
                    onSubmit={handleSubmit}
                    >
                    {({ isSubmitting }) => (

                    <Form className={Styles.editPersonalInfoForm}>
                            <div className={Styles.editPersonalInfoInput}>
                                <label htmlFor="userName" className={Styles.editPersonalInfoLabel}>Name:</label>
                                <Field type="text" id="userName" name="name" className={Styles.editPersonalInfoInputField} />
                                <ErrorMessage name="name" component="p" className={Styles.error} />
                            </div>
                            <div className={Styles.editPersonalInfoInput}>
                                <label htmlFor="userEmail" className={Styles.editPersonalInfoLabel}>Email:</label>
                                <Field type="email" id="userEmail" name="email" className={Styles.editPersonalInfoInputField} />
                                <ErrorMessage name="email" component="p" className={Styles.error} />
                            </div>
                            <div className={Styles.editPersonalInfoInput}>
                                <label htmlFor="userPassword" className={Styles.editPersonalInfoLabel}>Password:</label>
                                <Field type="password" id="userPassword" name="password" className={Styles.editPersonalInfoInputField} />
                                <ErrorMessage name="password" component="p" className={Styles.error} />
                            </div>
                            <div className={Styles.editPersonalInfoButtonContainer}>
                                <button type="submit" className={Styles.editPersonalInfoButton} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save' }</button>
                            </div>
                        </Form>
                    )}
                    </Formik>
                </div>
            </>
            }
        </>
    )
}

export default EditPersonalInfo
