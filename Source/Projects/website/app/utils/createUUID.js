/**
 * [createUUID returns a guid without he dashes]
 * @return {[type]} [description]
 */
const createUUID = () => {
    // http://www.ietf.org/rfc/rfc4122.txt
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i += 1) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // eslint-disable-line no-bitwise
  s[8] = s[13] = s[18] = s[23] = '-'; // eslint-disable-line no-multi-assign

  const uuid = s.join('');
  return uuid;
};

export default createUUID;
