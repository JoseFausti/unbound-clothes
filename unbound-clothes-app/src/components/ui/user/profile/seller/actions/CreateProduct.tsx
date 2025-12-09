import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Styles from "./CreateProduct.module.css";
import { createProductSchema, type CreateProductInput } from "../../../../../../types/schemas.zod";
import useAuth from "../../../../../../hooks/useAuth";
import Loader from "../../../../loader/Loader";
import { Navigate } from "react-router-dom";
import { categories, type IProduct, type Category, type ICloudinaryUpload, type ICreateUpdateProduct } from "../../../../../../types/schemas.db";
import axiosInstance from "../../../../../../config/axios";
import { errorBanner, successBanner } from "../../../../../../utils/functions";
import useImage from "../../../../../../hooks/useImagePreview";
import { useAppDispatch } from "../../../../../../hooks/redux";
import { addProduct } from "../../../../../../store/slices/productsSlice";
import { updateUser } from "../../../../../../store/slices/userSlice";

interface Props {
  closeModal: () => void;
}

const CreateProduct: React.FC<Props> = ({closeModal}) => {

  const {user, loading} = useAuth();
  const { file, preview, error, handleImageChange, reset } = useImage()

  const dispatch = useAppDispatch();

  const initialValues: CreateProductInput = {
    name: "",
    description: "",
    price: 0,
    category: "SHIRTS",
  };

  if (loading) return <Loader />
  if (!loading && !user) return <Navigate to="/" replace />

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={toFormikValidationSchema(createProductSchema)}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {

          const product: ICreateUpdateProduct = {
            name: values.name,
            description: values.description,
            imageUrl: undefined,
            price: values.price,
            category: values.category as Category,
            sellerId: user!.id
          }

          if (file) {
            const formData = new FormData()
            formData.append('file', file)
            const { data } = await axiosInstance.post<ICloudinaryUpload>('/upload/cloudinary', formData)
            product.imageUrl = data.url
          }
          const res = await axiosInstance.post<IProduct>("/products", product);
          if (res.data) {
            successBanner();
            dispatch(addProduct(res.data));
            dispatch(updateUser({ ...user! , sellerProducts: [...user!.sellerProducts, res.data] }));
            resetForm();
            closeModal();
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          errorBanner()
        } 
        finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, handleChange }) => (
        <Form className={Styles.form}>
          <h2 className={Styles.title}>Create New Product</h2>

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

          <div className={Styles.fieldGroup}>
            <label htmlFor="price">Price $</label>
            <Field
              type="number"
              name="price"
              min="0"
              step="1"
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
              {isSubmitting ? "Creating..." : "Create Product"}
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

export default CreateProduct;
