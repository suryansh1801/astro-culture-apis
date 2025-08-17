// Utility for validating offers array structure at runtime

export function validateOffers(offers: any[]): string | null {
    const requiredFields = ['adjustment_type', 'adjustment_id', 'summary', 'contributors', 'display_tags'];
    const contributorFields = ['payment_instrument', 'banks', 'emi_months', 'card_networks'];

    const invalidOffers = offers.filter((offer) => {
        // Check top-level required fields
        for (const field of requiredFields) {
            if (!(field in offer)) return true;
        }
        // Check contributors object
        if (typeof offer.contributors !== 'object' || offer.contributors === null) return true;
        for (const cField of contributorFields) {
            if (!Array.isArray(offer.contributors[cField])) return true;
        }
        // Check display_tags is array
        if (!Array.isArray(offer.display_tags)) return true;
        return false;
    });
    if (invalidOffers.length > 0) {
        return `Invalid offer(s) in request body. Each offer must have: ${requiredFields.join(', ')} (with contributors and display_tags as arrays).`;
    }
    return null;
}
