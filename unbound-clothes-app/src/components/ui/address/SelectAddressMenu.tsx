import Styles from "./SelectAddressMenu.module.css";
import type { IDirection } from "../../../types/schemas.db";
import { type Dispatch, type SetStateAction } from "react";
import useAuth from "../../../hooks/useAuth";

interface SelectAddressMenuProps {
  closeModal: () => void;
  selectedAddress: IDirection | undefined;
  setSelectedAddress: Dispatch<SetStateAction<IDirection | undefined>>;
  handlePurchase: (e: React.MouseEvent) => void;
}

const SelectAddressMenu: React.FC<SelectAddressMenuProps> = ({
  closeModal,
  selectedAddress,
  setSelectedAddress,
  handlePurchase,
}) => {
  const { user } = useAuth();

  if (!user) {
    closeModal();
    return null;
  }

  return (
    <div className={Styles.selectAddressMenuWrapper}>
        <div className={Styles.selectAddressMenuContainer}>
        {/* Header */}
        <div className={Styles.selectAddressMenuHeader}>
            <h3 className={Styles.selectAddressMenuTitle}>Select Address</h3>
            <button
                onClick={closeModal}
                className={Styles.selectAddressMenuCloseButton}
            > 
            ✕ 
            </button>
        </div>

        {/* Address List */}
        <div className={Styles.selectAddressMenuList}>
            {user.directions.length === 0 ? (
            <p className={Styles.noAddressesText}>
                You have no saved addresses.
            </p>
            ) : (
            user.directions.map((d) => (
                <div
                    key={d.id}
                    className={`${Styles.addressCard} ${selectedAddress ? Styles.active : ""}`}
                    onClick={() => setSelectedAddress(d)}
                >
                    <p className={Styles.addressText}>{d.address}</p>
                </div>
            ))
            )}
        </div>

        {/* Confirm Button */}
        <div className={Styles.selectAddressMenuButtonContainer}>
            <button
            onClick={handlePurchase}
            className={Styles.selectAddressMenuButton}
            disabled={!user.directions.length}
            >
            Checkout
            </button>
        </div>
        </div>
    </div>
  );
};

export default SelectAddressMenu;
