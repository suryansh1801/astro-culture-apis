// Helper: Check minimum order value
function hasMinOrder(summary: string, amount: number): boolean {
    const minOrderMatch = summary.match(/Min Order Value ₹(\d+)/i);
    if (minOrderMatch) {
        const minOrderValue = parseInt(minOrderMatch[1], 10);
        return amount >= minOrderValue;
    }
    return true; // No minimum order specified
}
/**
 * Calculates the discount based on an offer's summary and the amount to pay.
 * @param summary The offer description string.
 * @param amountToPay The total amount of the order.
 * @returns The calculated discount amount.
 */
export function calculateDiscount(
    summary: string,
    amountToPay: number,
): number {
    if (!hasMinOrder(summary, amountToPay)) {
        return 0;
    }

    // 1. Flat discount: "Flat ₹500 off", "Flat ₹10 Cashback"
    const flatDiscountMatch = summary.match(/Flat ₹(\d+)/i);
    if (flatDiscountMatch) {
        return parseInt(flatDiscountMatch[1], 10);
    }

    // 2. Percentage discount: "10% off", "20% discount", "15% cashback"
    const percentageDiscountMatch = summary.match(
        /(\d+)% (?:off|discount|cashback)/i,
    );
    if (percentageDiscountMatch) {
        const percentage = parseInt(percentageDiscountMatch[1], 10);
        let discount = (percentage / 100) * amountToPay;
        // Cap: "up to ₹1500"
        const upToMatch = summary.match(/up to ₹(\d+)/i);
        if (upToMatch) {
            const cap = parseInt(upToMatch[1], 10);
            discount = Math.min(discount, cap);
        }
        return Math.round(discount);
    }

    // 3. Generic additional discount: "Get additional ₹500 off ...", "₹500 off", "₹300 discount"
    // (not preceded by 'Flat' or a percentage)
    // This will match '₹500 off', '₹300 discount', 'Get additional ₹500 off ...'
    const genericDiscountMatch = summary.match(
        /(?:Get additional |^)₹(\d+) (?:off|discount)/i,
    );
    if (genericDiscountMatch) {
        return parseInt(genericDiscountMatch[1], 10);
    }

    return 0; // No discount pattern found
}
