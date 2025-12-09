import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Styles from "./UpdateProduct.module.css";
import { createProductSchema, type CreateProductInput } from "../../../../../../types/schemas.zod";
import useAuth from "../../../../../../hooks/useAuth";
import Loader from "../../../../loader/Loader";
import { Navigate } from "react-router-dom";
import { categories, type IProduct, type Category, type ICloudinaryUpload, type ICreateUpdateProduct } from "../../../../../../types/schemas.db";
import axiosInstance from "../../../../../../config/axios";
import { errorBanner, isAdmin, successBanner } from "../../../../../../utils/functions";
import useImage from "../../../../../../hooks/useImagePreview";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { updateProducts as updateProductAction } from "../../../../../../store/slices/productsSlice";
import { updateUser } from "../../../../../../store/slices/userSlice";

interface Props {
  closeModal: () => void;
  product: IProduct;
}

const UpdateProduct: React.FC<Props> = ({ closeModal, product }) => {
  const { user, loading } = useAuth();
  const { file, preview, error, handleImageChange, reset } = useImage();
  const dispatch = useAppDispatch();

  const initialValues: CreateProductInput = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
  };

  if (loading) return <Loader />;
  if (!loading && !user) return <Navigate to="/" replace />;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(createProductSchema)}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {

        const adminRole = isAdmin(user!.role);

        try {
          const updatedProduct: ICreateUpdateProduct = {
            name: values.name,
            description: values.description,
            imageUrl: product.imageUrl,
            price: values.price,
            category: values.category as Category,
            sellerId: adminRole ? product.sellerId : user!.id,
          };

          if (file) {
            const formData = new FormData();
            formData.append("file", file);
            const { data } = await axiosInstance.post<ICloudinaryUpload>(
              "/upload/cloudinary",
              formData
            );
            updatedProduct.imageUrl = data.url;
          }

          const res = await axiosInstance.put<IProduct>(
            `/products/${product.id}`,
            updatedProduct
          );

          if (res.data) {
            dispatch(updateProductAction(res.data));
            dispatch(updateUser({ 
              ...user! , 
              sellerProducts: user!.sellerProducts.map(p =>
                p.id === res.data.id ? res.data : p
              ), 
            }));
            successBanner();
            closeModal();
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          errorBanner();
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, handleChange }) => (
        <Form className={Styles.form}>
          <h2 className={Styles.title}>Update Product</h2>

          <div className={Styles.fieldGroup}>
            <label htmlFor="name">Name</label>
            <Field name="name" placeholder="Enter product name" />
            <ErrorMessage name="name" component="p" className={Styles.error} />
          </div>

          <div className={Styles.fieldGroup}>
            <label htmlFor="description">Description</label>
            <Field
              as="textarea"
              name="description"
              rows={4}
              placeholder="Enter product description"
            />
            <ErrorMessage name="description" component="p" className={Styles.error} />
          </div>

          {/* Image Upload */}
          <div className={Styles.inputSection}>
            <label htmlFor="imageUrl" className={Styles.inputFileLabel}>
              Product Image:
            </label>

            {preview ? (
              <div className={Styles.previewContainer}>
                <img src={preview} alt="Preview" className={Styles.previewImage} />
                <button
                  type="button"
                  className={Styles.resetButton}
                  onClick={reset}
                >
                  Reset
                </button>
              </div>
            ) : (
              <div className={Styles.previewContainer}>
                <img
                  src={product.imageUrl}
                  alt="Current"
                  className={Styles.previewImage}
                />
                <input
                  className={Styles.inputFile}
                  type="file"
                  id="imageUrl"
                  name="imageUrl"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
            {error && <p className={Styles.error}>{error}</p>}
          </div>

          <div className={Styles.fieldGroup}>
            <label htmlFor="price">Price (USD)</label>
            <Field
              type="number"
              name="price"
              min="0"
              step="0.01"
              onChange={handleChange}
              value={values.price}
            />
            <ErrorMessage name="price" component="p" className={Styles.error} />
          </div>

          <div className={Styles.fieldGroup}>
            <label htmlFor="category">Category</label>
            <Field as="select" name="category">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Field>
            <ErrorMessage name="category" component="p" className={Styles.error} />
          </div>

          <div className={Styles.actions}>
            <button type="submit" disabled={isSubmitting} className={Styles.submit}>
              {isSubmitting ? "Updating..." : "Update Product"}
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

export default UpdateProduct;
