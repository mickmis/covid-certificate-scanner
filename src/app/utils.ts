// tslint:disable:no-bitwise
export function toHexString(byteArray: Uint8Array): string {
  return Array.prototype.map.call(byteArray, byte => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function formatDate(date: Date, time: boolean): string {
  return time ?
    date.toLocaleString('fr', {timeZoneName: 'short'}) :
    date.toLocaleDateString('fr', {timeZoneName: 'short'});
}
