/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { Payment } from "@mercadopago/sdk-react";
import type { MpCustomization, MpInitialization } from "../../../types/schemas.mp";
import useTheme from "../../../hooks/useTheme";
import axiosInstance from "../../../config/axios";
import { frontendUrl } from "../../../config/config";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { clearCart } from "../../../store/slices/cartSlice";

type Props = {
    amount: number;
    directionId: string;
    preferenceId?: string;
};

const PaymentBrick = ({amount, directionId, preferenceId }: Props) => {
    const {theme} = useTheme();
    const {cartId} = useAppSelector(state => state.cart);
    const brickContainer = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();

    const initialization: MpInitialization = {
        amount,
        preferenceId,
    };

    const customization: MpCustomization = {
        paymentMethods: {
        ticket: "all",
        creditCard: "all",
        prepaidCard: "all",
        debitCard: "all",
        mercadoPago: "all",
        },
        visual: {
            style: {
                theme: theme === "dark" ? "dark" : "flat",
            }
        }
    };

    const onSubmit = async ({ formData }: any) => {
        console.log("Brick enviado");
        if (!cartId) return;
        await axiosInstance.post<Record<string, any>>("/mp/process_payment", { 
            cartId,
            directionId,
            formData 
        })
            .then(res => 
                res.data.status === "approved"
                    ? (() =>{
                        dispatch(clearCart());
                        window.location.href = `${frontendUrl}/cart?result=success`
                    })()
                    : res.data.status === "pending"
                        ? window.location.href = `${frontendUrl}/cart?result=pending`
                        : window.location.href = `${frontendUrl}/cart?result=failure`
            )
            .catch((error) => {
                window.location.href = `${frontendUrl}/cart?result=failure`
                console.log("Brick error:", error)
            });
    };

    const onError = async (error: any) => {
        console.error("Brick error:", error);
    };

    const onReady = async () => {
        console.log("Brick listo para usar");
    };

    return (
        <div
            ref={brickContainer}
            style={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                padding: "1rem",
            }}
        >
            <Payment
                initialization={initialization}
                customization={customization}
                onSubmit={onSubmit}
                onError={onError}
                onReady={onReady}
            />
        </div>
    );
};

export default PaymentBrick;
