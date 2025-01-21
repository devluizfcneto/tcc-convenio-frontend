export const formatDate = (date: string) => {
    if (!date) {
        return '';
    }

    const dateArr = date.split("-");
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
}

export const formatValue = (value: number) => {
    if (!value) {
        return '';
    }

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).format(value);
}

export const formatDateToString = (date: Date) => {
    if(!date) {
        return '';
    }

    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();
    return `${day.length === 1 ? '0' + day : day}/${month.length === 1 ?  '0' + month : month}/${year}`;
}

export const formatStringStartYear = (year: string) => {
    return `01/01/${year}`;
}

export const formatStringEndYear = (year: string) => {
    return `31/12/${year}`;
}