import { DateUtils } from './date-utils';

describe('makeDateUtils', () => {
  it('addHoursToDate', async () => {
    const date = new Date('2022-05-18T14:50:11.603Z');
    const datePlus2Hours = new Date('2022-05-18T16:50:11.603Z');

    const result = DateUtils.addHoursToDate(date, 2);

    expect(result).toMatchObject(datePlus2Hours);
  });

  it('getSecondsSinceEpoch', async () => {
    const date = new Date('2022-05-18T14:50:11.603Z');
    const timestampInSec = 1652885411;

    const result = DateUtils.getSecondsSinceEpoch(date);

    expect(result).toBe(timestampInSec);
  });
});
