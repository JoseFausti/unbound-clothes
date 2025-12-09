import type { IProductVariant } from "../../../../../../types/schemas.db";
import Styles from "./SoldVariantsModal.module.css";

interface Props {
  closeModal: () => void;
  productName: string;
  variants: (Pick<IProductVariant, "id" | "color" | "size" | "stock"> & { quantity: number })[];
}

const SoldVariantsModal: React.FC<Props> = ({ closeModal, productName, variants }) => {
  return (
    <div className={Styles.overlay}>
      <div className={Styles.modal}>
        <h2>Sales - {productName}</h2>

        <table className={Styles.table}>
          <thead>
            <tr>
              <th>Color</th>
              <th>Size</th>
              <th>Sold</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {variants.map(v => (
              <tr key={v.id}>
                <td>{v.color}</td>
                <td>{v.size}</td>
                <td>{v.quantity}</td>
                <td>{v.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className={Styles.closeButton} onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SoldVariantsModal;
