import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Styles from "./AddStockProduct.module.css";
import useAuth from "../../../../../../hooks/useAuth";
import Loader from "../../../../loader/Loader";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../../../../../config/axios";
import { errorBanner, successBanner } from "../../../../../../utils/functions";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { updateProducts as updateProductAction } from "../../../../../../store/slices/productsSlice";
import type { Color, ICreateUpdateProductVariant, IProduct } from "../../../../../../types/schemas.db";
import { createProductVariantSchema } from "../../../../../../types/schemas.zod";
import { useVariant } from "../../../../../../hooks/useVariant";

interface Props {
  closeModal: () => void;
  product: IProduct;
}

const AddStockProduct: React.FC<Props> = ({ closeModal, product }) => {
  const { user, loading } = useAuth();
  const dispatch = useAppDispatch();

  const {avaliableColors, avaliableSizes} = useVariant(product)

  const isOneSize = avaliableSizes.length === 1 && avaliableSizes[0] === "ONE_SIZE";

  const initialValues: ICreateUpdateProductVariant = {
    color: "" as Color,
    size: isOneSize ? "ONE_SIZE" : "",
    stock: 0,
  };

  if (loading) return <Loader />;
  if (!loading && !user) return <Navigate to="/" replace />;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(createProductVariantSchema)}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          
          const updatedVariant: ICreateUpdateProductVariant = {
            color: values.color,
            size: values.size,
            stock: values.stock,
          };
          
          const existingVariant = product.variants.find(
            v => v.color === updatedVariant.color && v.size === updatedVariant.size
          );

          const updatedVariants = [
            ...product.variants.filter(
              v => !(v.color === updatedVariant.color && v.size === updatedVariant.size)
            ),
            {
              ...updatedVariant,
              id: existingVariant?.id,
            }
          ];

          const res = await axiosInstance.put<IProduct>(
              `/products/${product.id}/variants`,
              updatedVariants
            );
            
            if (res.data) {
                dispatch(updateProductAction(res.data));
                successBanner();
                closeModal();
            }
        } catch (error) {
            console.log(error);
            errorBanner();
        } finally {
            setSubmitting(false);
        }
    }}
    >
      {({ isSubmitting, values, handleChange }) => (
          <Form className={Styles.form}>
          <h2 className={Styles.title}>Add Stock</h2>

          <div className={Styles.fieldGroup}>
            <label htmlFor="color">Color</label>
            <FieldArray name="color" >
              {() => (
                  <select
                  name="color"
                  value={values.color}
                  onChange={handleChange}
                  >
                  <option value="">Select a Color</option>
                  {avaliableColors.map((color) => (
                      <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              )}    
            </FieldArray>            
            <ErrorMessage name="color" component="p" className={Styles.error} />
          </div>

          <div className={Styles.fieldGroup}>
            <label htmlFor="size">Size</label>
            <FieldArray name="size" >
              {() => (
                  <select
                  name="size"
                  value={values.size}
                  onChange={handleChange}
                >
                  {!isOneSize && <option value="">Select a Size</option>}
                  {avaliableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              )}    
            </FieldArray>            
            <ErrorMessage name="size" component="p" className={Styles.error} />
          </div>

          <div className={Styles.fieldGroup}>
            <label htmlFor="stock">Stock</label>
            <Field
              type="number"
              name="stock"
              min="0"
              step="1"
              onChange={handleChange}
              value={values.stock}
            />
            <ErrorMessage name="stock" component="p" className={Styles.error} />
          </div>

          <div className={Styles.actions}>
            <button type="submit" disabled={isSubmitting} className={Styles.submit}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={closeModal} className={Styles.cancel}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddStockProduct;
