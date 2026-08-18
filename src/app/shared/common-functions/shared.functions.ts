import { formatDate } from "@angular/common";

export class CnpjFormatter {
    static format(cnpj: string): string {
        if (!cnpj) {
            return cnpj;
        }

        const numbers = cnpj.replace(/\D/g, '');

        if (numbers.length !== 14) {
            throw new Error('CNPJ deve conter 14 dígitos.');
        }

        return numbers.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            '$1.$2.$3/$4-$5'
        );
    }

    static unformat(cnpj: string): string {
        return cnpj ? cnpj.replace(/\D/g, '') : cnpj;
    }
}

export class DateFormatter {
    static formatDate(date: string | null): string {
        if (!date) {
            return '-';
        }

        const [year, month, day] = date.split('-');

        if (!year || !month || !day) {
            return date;
        }

        return `${day}/${month}/${year}`;
    }

    static formatDateToISO(date: string): string {
        if (!date) {
            return date;
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return date;
        }

        return formatDate(parsedDate, 'yyyy-MM-dd', 'en-US');
    }
}