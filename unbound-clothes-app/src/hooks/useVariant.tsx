import { useEffect, useMemo, useState } from 'react';
import { 
    colors, 
    clothingCategories, shoeCategories,
    clothingSizes, shoeSizes, 
    type IProduct, 
    type IProductVariant, 
} from '../types/schemas.db';

export function useVariant(product: IProduct) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);

    const avaliableColors = Array.from(new Set(colors));
    let avaliableSizes: string[] = []; 
    
    if (clothingCategories.includes(product.category)) avaliableSizes = clothingSizes;
    if (shoeCategories.includes(product.category)) avaliableSizes = shoeSizes;
    if (product.category === "ACCESSORIES") avaliableSizes = ["ONE_SIZE"];

    const uniqueSizes = useMemo(() => 
        Array.from(new Set(product.variants?.map(v => v.size)))
    ,[product.variants]);

    const uniqueColors = useMemo(() => 
        Array.from(new Set(product.variants?.map(v => v.color)))
    ,[product.variants]);

    useEffect(() => {
        if (!selectedSize || !selectedColor) return setSelectedVariant(null);
        const variant = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor) ?? null;

        setSelectedVariant(variant);
        setQuantity(1); // Reset quantity
    }, [selectedSize, selectedColor, product.variants]);

    // Handlers
    const increaseQuantity = () => {
        if (!selectedVariant) return;
        if (selectedVariant.stock <= 0) return;
        setQuantity(q => Math.min(q + 1, selectedVariant.stock));
    };

    const decreaseQuantity = () => {
        setQuantity(q => Math.max(1, q - 1));
    };

    return {

        // Enums
        avaliableColors,
        avaliableSizes,

        // state
        quantity,
        selectedSize,
        selectedColor,
        selectedVariant,
        uniqueSizes,
        uniqueColors,

        // actions
        setSelectedSize,
        setSelectedColor,
        increaseQuantity,
        decreaseQuantity,
    };
}
