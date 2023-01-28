export function birthdayToYearAndMonthOld(date) {

    function monthDiff(d1, d2) {
        let months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }

    let years = 0;
    let months = 0;
    const now = new Date();
    const birthday = new Date(date);
    months = monthDiff(birthday, now);
    if (months > 11) {
        years = Math.floor(months / 12);
        months %= 12;
    }
    return { years, months }
}