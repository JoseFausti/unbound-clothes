import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Styles from "./UpdateDiscounts.module.css";
import useAuth from "../../../../../../hooks/useAuth";
import Loader from "../../../../loader/Loader";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../../../../../config/axios";
import { errorBanner, successBanner } from "../../../../../../utils/functions";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { updateProducts as updateProductAction } from "../../../../../../store/slices/productsSlice";
import type { IProduct } from "../../../../../../types/schemas.db";
import { updateDiscountSchema } from "../../../../../../types/schemas.zod";

interface Props {
  closeModal: () => void;
  product: IProduct;
  onUpdated?: (updated: IProduct) => void;
}

const UpdateDiscounts: React.FC<Props> = ({ closeModal, product, onUpdated }) => {
  const { user, loading } = useAuth();
  const dispatch = useAppDispatch();

  const initialValues = {
    discounts: product.discounts.map((d) => ({
      percentage: d.percentage,
      startDate: new Date(d.startDate).toISOString().split("T")[0],
      endDate: new Date(d.endDate).toISOString().split("T")[0],
    })),
  };

  if (loading) return <Loader />;
  if (!loading && !user) return <Navigate to="/" replace />;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(updateDiscountSchema)}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const res = await axiosInstance.put<IProduct>(
            `/products/${product.id}/discounts`,
            { discounts: values.discounts }
          );
          if (onUpdated) onUpdated(res.data);
          dispatch(updateProductAction({...product, discounts: res.data.discounts}));

          successBanner();
          closeModal();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          errorBanner();
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values }) => (
        <div className={Styles.updateDiscountsContainer}>
            <Form className={Styles.form}>
                <h2 className={Styles.title}>Manage Discounts</h2>

                <FieldArray name="discounts">
                    {({ remove, push }) => (
                    <div className={Styles.discountGroup}>
                        {values.discounts.map((_, index) => (
                        <div key={index} className={Styles.fieldGroup}>
                            <label>Percentage (%)</label>
                            <Field
                                name={`discounts.${index}.percentage`}
                                type="number"
                                min="1"
                                max="100"
                            />
                            <ErrorMessage
                                name={`discounts.${index}.percentage`}
                                component="p"
                                className={Styles.error}
                            />

                            <label>Start Date</label>
                            <Field name={`discounts.${index}.startDate`} type="date" />
                            <ErrorMessage
                                name={`discounts.${index}.startDate`}
                                component="p"
                                className={Styles.error}
                            />

                            <label>End Date</label>
                            <Field name={`discounts.${index}.endDate`} type="date" />
                            <ErrorMessage
                                name={`discounts.${index}.endDate`}
                                component="p"
                                className={Styles.error}
                            />

                            <div className={Styles.actions}>
                            <button
                                type="button"
                                className={Styles.cancel}
                                onClick={() => remove(index)}
                            >
                                Remove
                            </button>
                            </div>
                        </div>
                        ))}

                        <button
                            type="button"
                            className={Styles.submit}
                            onClick={() =>
                                push({
                                percentage: 10,
                                startDate: "",
                                endDate: "",
                                })
                            }
                        >
                            + Add Discount
                        </button>
                    </div>
                    )}
                </FieldArray>

                <div className={Styles.actions}>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={Styles.submit}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={closeModal}
                        className={Styles.cancel}
                    >
                        Cancel
                    </button>
                </div>
            </Form>
        </div>
      )}
    </Formik>
  );
};

export default UpdateDiscounts;
