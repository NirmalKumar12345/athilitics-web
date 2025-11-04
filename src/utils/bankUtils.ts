// src/utils/bankUtils.ts

/**
 * Returns the bank name for a given IFSC code prefix.
 * @param ifsc - IFSC code string
 */
export function getBankName(ifsc: string): string {
    if (!ifsc) return '';
    const prefix = ifsc.substring(0, 4).toUpperCase();
    switch (prefix) {
        case 'SBIN': return 'State Bank of India';
        case 'HDFC': return 'HDFC Bank';
        case 'ICIC': return 'ICICI Bank';
        case 'KKBK': return 'Kotak Mahindra Bank';
        case 'YESB': return 'Yes Bank';
        case 'AXIS': return 'Axis Bank';
        case 'BARB': return 'Bank of Baroda';
        case 'PUNB': return 'Punjab National Bank';
        case 'IDFB': return 'IDFC First Bank';
        case 'INDB': return 'IndusInd Bank';
        case 'MAHB': return 'Bank of Maharashtra';
        case 'CNRB': return 'Canara Bank';
        case 'SYNB': return 'Syndicate Bank';
        case 'UBIN': return 'Union Bank of India';
        case 'IOBA': return 'Indian Overseas Bank';
        case 'CORP': return 'Corporation Bank';
        case 'VIJB': return 'Vijaya Bank';
        case 'FDRL': return 'Federal Bank';
        case 'SCBL': return 'Standard Chartered Bank';
        case 'CITY': return 'Citi Bank';
        case 'SBHY': return 'State Bank of Hyderabad';
        case 'SBBJ': return 'State Bank of Bikaner & Jaipur';
        case 'SBTR': return 'State Bank of Travancore';
        case 'SBBI': return 'State Bank of Mysore';
        default: return 'Unknown Bank';
    }
}
