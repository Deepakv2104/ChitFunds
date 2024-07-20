export const monthStringToNumber = (month) => {
    const monthMap = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11
    };
    return monthMap[month];
  };
  
  export const generateMonths = (numMonths) => {
    const months = [];
    const date = new Date();
  
    for (let i = 0; i < numMonths; i++) {
      const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
      const year = date.getFullYear();
      months.push(`${month}${year}`);
      date.setMonth(date.getMonth() + 1);
    }
  
    return months;
  };
  
  export const calculateEndMonth = (startMonth) => {
    const months = generateMonths(40);
    const startIndex = months.indexOf(startMonth);
    if (startIndex === -1) return '';
  
    const endIndex = startIndex + 19;
    return months[endIndex] || '';
  };
  