/* eslint-disable @typescript-eslint/no-unused-vars */
import { Close } from '@mui/icons-material';
import Styles from './EditUserImage.module.css'
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/redux';
import useImage from '../../../../../hooks/useImagePreview';
import { errorBanner, successBanner } from '../../../../../utils/functions';
import axiosInstance from '../../../../../config/axios';
import type { ICloudinaryUpload, IUser } from '../../../../../types/schemas.db';
import { updateUser } from '../../../../../store/slices/userSlice';
import Loader from '../../../loader/Loader';

interface EditUserImageProps {
  closeModal: () => void;
}

const EditUserImage = ({ closeModal }: EditUserImageProps) => {

  const {user} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const {file, error, preview, handleImageChange, reset} = useImage();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      if (!file) return errorBanner();

      // Delete previous image
      if (user.imageUrl) {
        try {
          await axiosInstance.request({
            method: "DELETE",
            url: "/upload/cloudinary",
            data: { imageUrl: user.imageUrl },
          });
        } catch (error){/*Empty*/}
      }

      const formData = new FormData();
      formData.append("file", file);
      
      // Upload image
      const { data } = await axiosInstance.post<ICloudinaryUpload>("/upload/cloudinary", formData);
      if (!data.url) throw new Error("No se recibió la URL de la imagen");
      const newImageUrl = data.url;

      // Update user
      const res = await axiosInstance.put<IUser>(`/users/${user.id}/image`, { imageUrl: newImageUrl });
      if (!res.data.imageUrl) throw new Error("Error al actualizar usuario");
      
      // Update store
      dispatch(updateUser({ ...user, imageUrl: res.data.imageUrl }));
      successBanner();
      reset();
      closeModal();
    } catch (error) {
      errorBanner();
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <Loader />;
  return (
    <div className={Styles.editUserImageContainer}>
      <div className={Styles.editUserImageHeader}>
        <h3 className={Styles.editUserImageTitle}>Edit User Image</h3>
        <Close className={Styles.editUserImageCloseButton} onClick={closeModal}>X</Close>
      </div>
      <form className={Styles.editUserImageForm} onSubmit={handleSubmit}>
        <div className={Styles.editUserImageInput}>
          <label htmlFor="imageUrl" className={Styles.inputFileLabel}>User Image:</label>
          { preview 
              ? 
              <div className={Styles.previewContainer}>
                  <img src={preview} alt="Preview" className={Styles.previewImage}/>
                  <button className={Styles.resetButton} onClick={reset}>Reset</button>
              </div>
              :
              <>
                <input className={Styles.inputFile} type="file" id="imageUrl" name='imageUrl' accept='image/*' onChange={handleImageChange}/>
              </>
          }
          {error && <p className={Styles.error}>{error}</p>}
        </div>
        <div className={Styles.editUserImageButtonContainer}>
          <button type="submit" className={Styles.editUserImageButton}>Save</button>
        </div>
      </form>
    </div>
  )
}

export default EditUserImage
