import { useEffect, useState, useMemo } from "react";
import type { IProduct } from "../../../types/schemas.db";
import ProductCard from "./ProductCard";
import Styles from "./ProductsList.module.css";
import { syncFavorites } from "../../../store/slices/userSlice";
import { useAppDispatch } from "../../../hooks/redux";
import useAuth from "../../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";

interface Props {
  products: IProduct[];
}

const ProductsList: React.FC<Props> = ({ products }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [selectedOrder, setSelectedOrder] = useState("a_z");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [openOrder, setOpenOrder] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  useEffect(() => {
    return () => {
      if (user?.role === "USER") dispatch(syncFavorites(user.id));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==== OPTIONS ====
  const orderOptions = [
    { value: "a_z", label: "A-Z" },
    { value: "z_a", label: "Z-A" },
    { value: "price_asc", label: "Price ↑" },
    { value: "price_desc", label: "Price ↓" },
  ];

  const filterOptions = useMemo(
    () => [
      { value: "all", label: "All" },
      ...Array.from(new Set(products.map((p) => p.category))).map((c) => ({
        value: c.toLowerCase(),
        label: c,
      })),
    ],
    [products]
  );

  // ==== SORTED + FILTERED PRODUCTS ====
  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (selectedFilter !== "all") {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    return list.sort((a, b) => {
      switch (selectedOrder) {
        case "a_z":
          return a.name.localeCompare(b.name);
        case "z_a":
          return b.name.localeCompare(a.name);
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [products, selectedOrder, selectedFilter]);

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.filtersRow}>
        {/* === Order Select === */}
        <div className={Styles.selectArea}>
          <label>Order by</label>

          <button
            className={Styles.selectButton}
            onClick={() => setOpenOrder(!openOrder)}
          >
            {orderOptions.find((x) => x.value === selectedOrder)?.label}
            <span className={`${Styles.arrow} ${openOrder ? Styles.open : ""}`}>
              ▾
            </span>
          </button>

          {openOrder && (
            <ul className={Styles.dropdown}>
              {orderOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    setSelectedOrder(opt.value);
                    setOpenOrder(false);
                  }}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* === Filter Select === */}
        {!category && (
          <div className={Styles.selectArea}>
            <label>Category</label>

            <button
              className={Styles.selectButton}
              onClick={() => setOpenFilter(!openFilter)}
            >
              {filterOptions.find((x) => x.value === selectedFilter)?.label}
              <span
                className={`${Styles.arrow} ${openFilter ? Styles.open : ""}`}
              >
                ▾
              </span>
            </button>

            {openFilter && (
              <ul className={Styles.dropdown}>
                {filterOptions.map((opt) => (
                  <li
                    key={opt.value}
                    onClick={() => {
                      setSelectedFilter(opt.value);
                      setOpenFilter(false);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* === GRID === */}
      <div className={Styles.grid}>
        {visibleProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
