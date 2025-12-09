import { useState } from "react";
import Styles from "./EditDirections.module.css";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { directionSchema, type DirectionValues } from "../../../../../types/schemas.zod";
import type { IDirection } from "../../../../../types/schemas.db";
import { updateUser } from "../../../../../store/slices/userSlice";
import axiosInstance from "../../../../../config/axios";
import { errorBanner, successBanner } from "../../../../../utils/functions";

interface EditDirectionsProps {
  closeModal: () => void;
  initialAddress?: string;
  directionId?: string;
}

const EditDirections = ({ closeModal, initialAddress = "", directionId }: EditDirectionsProps) => {
  
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.user);
  const [loading, setLoading] = useState(false);

  if (!user) return;

  // Parse initialAddress into components
  const [initStreet, initNumber] = (() => {
    const parts = initialAddress.split(",")[0]?.trim().split(" ") || [];
    const num = parts.pop() || "";
    return [parts.join(" "), num];
  })();

  const initialValues: DirectionValues = {
    street: initStreet || "",
    number: initNumber || "",
    city: initialAddress.split(",")[1]?.trim() || "",
    province: initialAddress.split(",")[2]?.trim() || "",
  };

  const handleSubmit = async (values: DirectionValues) => {
    const { street, number, city, province } = values;
    const address = `${street} ${number}, ${city}, ${province}`;

    try {
      setLoading(true);

      if (directionId) {
        const { data } = await axiosInstance.put<IDirection>(`/directions/${directionId}`, { userId: user.id, address });
        dispatch(updateUser({
          ...user,
          directions: user.directions.map(d => d.id === data.id ? data : d)
        }));
      } else {
        const { data } = await axiosInstance.post<IDirection>(`/directions`, { userId: user.id, address });
        dispatch(updateUser({
          ...user,
          directions: [...user.directions, data]
        }));
      }
      
      successBanner();
      closeModal();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      errorBanner();
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className={Styles.editDirectionsContainer}>
        <div className={Styles.editDirectionsHeader}>
          <h3 className={Styles.editDirectionsTitle}>
            {directionId ? "Edit Direction" : "Add Direction"}
          </h3>
          <button onClick={closeModal} className={Styles.editDirectionsCloseButton}>
            ✕
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(directionSchema)}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className={Styles.editDirectionsForm}>
              <div className={Styles.editDirectionsInput}>
                <label className={Styles.editDirectionsLabel}>Street:</label>
                <Field
                  name="street"
                  type="text"
                  className={Styles.editDirectionsInputField}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("street", e.target.value.replace(/,/g, ""))
                  }
                />
                <ErrorMessage name="street" component="p" className={Styles.error} />
              </div>

              <div className={Styles.editDirectionsInput}>
                <label className={Styles.editDirectionsLabel}>Number:</label>
                <Field
                  name="number"
                  type="text"
                  className={Styles.editDirectionsInputField}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("number", e.target.value.replace(/,/g, ""))
                  }
                />
                <ErrorMessage name="number" component="p" className={Styles.error} />
              </div>

              <div className={Styles.editDirectionsInput}>
                <label className={Styles.editDirectionsLabel}>City:</label>
                <Field
                  name="city"
                  type="text"
                  className={Styles.editDirectionsInputField}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("city", e.target.value.replace(/,/g, ""))
                  }
                />
                <ErrorMessage name="city" component="p" className={Styles.error} />
              </div>

              <div className={Styles.editDirectionsInput}>
                <label className={Styles.editDirectionsLabel}>Province:</label>
                <Field
                  name="province"
                  type="text"
                  className={Styles.editDirectionsInputField}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue("province", e.target.value.replace(/,/g, ""))
                  }
                />
                <ErrorMessage name="province" component="p" className={Styles.error} />
              </div>

              <div className={Styles.editDirectionsButtonContainer}>
                <button
                  type="submit"
                  className={Styles.editDirectionsButton}
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting
                    ? "Saving..."
                    : directionId
                    ? "Update"
                    : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
};

export default EditDirections;