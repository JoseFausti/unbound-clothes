import { useState } from "react";
import Styles from "../ProfileUser.module.css";
import EditUserImage from "../actions/EditUserImage";
import EditPersonalInfo from "../actions/EditPersonalInfo";
import EditDirections from "../actions/EditDirections";
import useAuth from "../../../../../hooks/useAuth";
import axiosInstance from "../../../../../config/axios";
import { useAppDispatch } from "../../../../../hooks/redux";
import { updateUser } from "../../../../../store/slices/userSlice";
import type { IDirection } from "../../../../../types/schemas.db";
import { deleteDirectionBanner, errorBanner } from "../../../../../utils/functions";

const ProfileUserMain = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState({
    userImage: false,
    personalInfo: false,
    directions: false,
  });

  const [directionActive, setDirectionActive] = useState<{
    id: string;
    address: string;
  } | null>(null);

  const closeModal = () => {
    setEditMode({ userImage: false, personalInfo: false, directions: false });
  };

  const handleDeleteDirection = async (id: string) => {
    if (!user) return;
    try {
      const confirm = await deleteDirectionBanner();
      if (confirm) {
        const res = await axiosInstance.delete<IDirection>(`/directions/${id}`);

        dispatch(
          updateUser({
            ...user,
            directions: user.directions.filter((d) => d.id !== res.data.id),
          })
        );
      }
    } catch {
      errorBanner();
    }
  };

  return (
    <div className={Styles.mainWrapper}>

      {/* EDIT MODALS */}
      {(editMode.userImage || editMode.personalInfo || editMode.directions) && (
        <>
          {editMode.userImage && <EditUserImage closeModal={closeModal} />}
          {editMode.personalInfo && <EditPersonalInfo closeModal={closeModal} />}
          {editMode.directions && (
            <EditDirections
              closeModal={closeModal}
              initialAddress={directionActive?.address}
              directionId={directionActive?.id}
            />
          )}
        </>
      )}

      {/* MAIN CONTENT */}
      {!editMode.userImage &&
        !editMode.personalInfo &&
        !editMode.directions && (
          <div className={Styles.sectionList}>

            {/* IMAGE */}
            <section className={Styles.section}>
              <h3 className={Styles.sectionTitle}>Profile Picture</h3>

              <div className={Styles.imageRow}>
                <div className={Styles.imageBox}>
                  <img
                    src={user?.imageUrl}
                    alt="User"
                    className={Styles.profileImage}
                  />
                </div>

                <button
                  className={Styles.primaryButton}
                  onClick={() =>
                    setEditMode((p) => ({ ...p, userImage: true }))
                  }
                >
                  Change Image
                </button>
              </div>
            </section>

            {/* PERSONAL INFO */}
            <section className={Styles.section}>
              <h3 className={Styles.sectionTitle}>Personal Info</h3>

              <div className={Styles.fieldList}>
                <div className={Styles.fieldRow}>
                  <label className={Styles.fieldLabel}>Name:</label>
                  <span className={Styles.fieldValue}>{user?.name}</span>
                </div>

                <div className={Styles.fieldRow}>
                  <label className={Styles.fieldLabel}>Email:</label>
                  <span className={Styles.fieldValue}>{user?.email}</span>
                </div>
              </div>

              <button
                className={Styles.primaryButton}
                onClick={() =>
                  setEditMode((p) => ({ ...p, personalInfo: true }))
                }
              >
                Edit Personal Info
              </button>
            </section>

            {/* DIRECTIONS */}
            {user?.role === "USER" && (
              <section className={Styles.section}>
                <h3 className={Styles.sectionTitle}>Directions</h3>

                {user.directions.filter((d) => !d.deleted).length > 0 ? (
                  <div className={Styles.fieldList}>
                    {user.directions
                      .filter((d) => !d.deleted)
                      .map((dir) => (
                        <div key={dir.id} className={Styles.directionCard}>
                          <div className={Styles.fieldValue}>
                            {dir.address}
                          </div>

                          <div className={Styles.directionActions}>
                            <button
                              className={Styles.primaryButton}
                              onClick={() => {
                                setDirectionActive(dir);
                                setEditMode({
                                  userImage: false,
                                  personalInfo: false,
                                  directions: true,
                                });
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className={Styles.deleteButton}
                              onClick={() => handleDeleteDirection(dir.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className={Styles.emptyText}>No directions added yet.</p>
                )}

                <button
                  className={Styles.primaryButton}
                  onClick={() => {
                    setDirectionActive(null);
                    setEditMode({
                      userImage: false,
                      personalInfo: false,
                      directions: true,
                    });
                  }}
                >
                  Add New
                </button>
              </section>
            )}
          </div>
        )}
    </div>
  );
};

export default ProfileUserMain;
