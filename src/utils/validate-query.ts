// Utility for validating /highest-discount query params at runtime

export function validateDiscountQuery(query: any): string | null {
    if (!('amountToPay' in query)) {
        return 'Query parameter "amountToPay" is required.';
    }

    if (isNaN(parseFloat(query.amountToPay))) {
        return 'amountToPay must be a valid number.';
    }
    if (
        !('bankName' in query) ||
        typeof query.bankName !== 'string' ||
        query.bankName === ''
    ) {
        return 'Query parameter "bankName" is required and must be a non-empty string.';
    }
    if (
        'paymentInstrument' in query &&
        typeof query.paymentInstrument !== 'string'
    ) {
        return 'Query parameter "paymentInstrument" must be a string if provided.';
    }
    return null;
}
