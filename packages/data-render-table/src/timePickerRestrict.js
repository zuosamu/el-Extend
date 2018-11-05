import moment from 'moment';

export function isBefore(time) {
    return moment(time).isBefore();
}

export function isDisableBefore(time) {
    return !isBefore(time);
}

export function isBetween(time, days = 0, rule = 'days') {
    return moment(time).isBetween(
        moment().subtract(days, rule),
        moment(),
        'second'
    );
}

export function isDisableBetween(time, days = 0, rule = 'days') {
    return !isBetween(time, days, rule);
}

export function initTimes(day) {
    return [
        moment()
            .subtract(day, 'days')
            .format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
    ];
}

export function initTimeSeconds(day) {
    return [
        moment()
            .subtract(day, 'days')
            .format('YYYY-MM-DD HH:mm:ss'),
        moment().format('YYYY-MM-DD HH:mm:ss')
    ];
}

export function differenceDays([start, end] = []) {
	return moment().isSame(end, 'day') ? moment().diff(start, 'days') : 0;
}
