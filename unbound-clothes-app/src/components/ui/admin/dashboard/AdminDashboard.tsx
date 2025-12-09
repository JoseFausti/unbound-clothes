import React, { useEffect, useState } from "react"
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
} from "@coreui/react"
import { CChart } from "@coreui/react-chartjs"
import styles from "./AdminDashboard.module.css"
import useTheme from "../../../../hooks/useTheme"
import type { IOrder, IUser } from "../../../../types/schemas.db"
import { Link, Navigate } from "react-router-dom"
import { getProductAndVariant } from "../../../../utils/functions"
import useAuth from "../../../../hooks/useAuth"
import Loader from "../../loader/Loader"

interface AdminDashboardProps {
  users: Omit<IUser, "password">[];
  orders: IOrder[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, orders }) => {

  const {user: currentUser, loading} = useAuth();

  const { theme } = useTheme();
  const root = getComputedStyle(document.documentElement);

  const [styleProperty, setStyleProperty] = useState({
    accentColor: root.getPropertyValue('--accent-color').trim(),
    accentColorRGB: root.getPropertyValue('--accent-color-rgb').trim(),
    textColor: root.getPropertyValue('--text-color').trim(),
    bgColor: root.getPropertyValue('--bg-color').trim(),
    boxShadow: root.getPropertyValue('--box-shadow').trim(),
  });

  useEffect(() => {
    setStyleProperty({
      accentColor: root.getPropertyValue('--accent-color').trim(),
      accentColorRGB: root.getPropertyValue('--accent-color-rgb').trim(),
      textColor: root.getPropertyValue('--text-color').trim(),
      bgColor: root.getPropertyValue('--bg-color').trim(),
      boxShadow: root.getPropertyValue('--box-shadow').trim(),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  if (loading) return <Loader />;
  if (!loading && !currentUser) return <Navigate to="/" replace />;

  const totalSales = orders.reduce((acc, order) => {
    const totalPrice = order.items.reduce((acc, item) => {
      const variantPrice = getProductAndVariant(item.variantId)?.product.price ?? 0;
      return acc + (variantPrice * item.quantity)
    }, 0); 
    return acc + totalPrice;
  }, 0);

  const usersByMonth = Array(12).fill(0);
  users.filter((user) => user.role !== "SUPER_ADMIN").forEach((user) => {
    if (user.createdAt) {
      const date = new Date(user.createdAt);
      const month = date.getMonth();
      usersByMonth[month] += 1;
    }
  });

  return (
    <div className={styles.coreuiWrapper}>
      <CContainer fluid className={styles.dashboardContainer}>
        <h2 className={styles.dashboardTitle}>Admin Dashboard</h2>

        <CRow className={styles.dashboardRow}>
          <CCol xs={12} md={4}>
            <CCard className={styles.dashboardCard}>
              <CCardBody>
                <Link to="/admin/users">
                  <CCardTitle className={styles.dashboardCardTitle}>
                    Active Users
                  </CCardTitle>
                  <CCardText className={styles.dashboardCardText}>
                    {users.filter((user) => user.role !== "SUPER_ADMIN").length}
                  </CCardText>
                </Link>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol xs={12} md={4}>
            <CCard className={styles.dashboardCard}>
              <CCardBody>
                <CCardTitle className={styles.dashboardCardTitle}>
                  Total Sales
                </CCardTitle>
                <CCardText className={`${styles.dashboardCardText} ${styles.totalSalesText}`}>
                  ${totalSales.toFixed(2)}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol xs={12} md={4}>
            <CCard className={styles.dashboardCard}>
              <CCardBody>
                <Link to="/admin/orders">
                  <CCardTitle className={styles.dashboardCardTitle}>
                    Approved Orders
                  </CCardTitle>
                  <CCardText className={styles.dashboardCardText}>
                    {orders.filter((order) => order.paymentStatus === "APPROVED").length}
                  </CCardText>
                </Link>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CRow 
          style={{
            width: "100%",
            maxWidth: "800px",
            height: "400px",
            margin: "0 auto", 
          }}
        >
          <CCol xs={12}>
            <CCard className={styles.chartCard}>
              <CCardBody>
                <CChart
                  type="line"
                  data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [
                      {
                        label: "New Users",
                        backgroundColor: `rgba(${styleProperty.accentColorRGB}, 0.5)`,
                        borderColor: styleProperty.accentColor,
                        pointBackgroundColor: styleProperty.textColor,
                        tension: 0.3,
                        data: usersByMonth,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          color: styleProperty.accentColor,
                          font: { size: 16, weight: "bold" },
                        },
                      },
                      tooltip: {
                        titleColor: styleProperty.accentColor, 
                        bodyFont: { size: 16, weight: "bold" },
                        bodyColor: styleProperty.textColor,
                        backgroundColor: styleProperty.bgColor,
                      },
                    },
                    scales: {
                      x: {
                        ticks: { color: styleProperty.textColor },
                        grid: { color: styleProperty.boxShadow },
                      },
                      y: {
                        ticks: { color: styleProperty.textColor },
                        grid: { color: styleProperty.boxShadow },
                        beginAtZero: true,
                      },
                    },
                  }}
                  style={{ width: "100%", height: "400px" }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default AdminDashboard
