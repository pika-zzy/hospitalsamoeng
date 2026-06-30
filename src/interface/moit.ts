export interface Moit {
  ID: number;
  Name: string;
  Description: string;
  YearID: number;
}

export const moitList: Moit[] = [
  {
    ID: 1,
    Name: "หมวด MOIT แผนกบริหาร",
    Description: "หมวดย่อยเกี่ยวกับแผนกบริหารและงานเลขานุการ",
    YearID: 2568
  },
  {
    ID: 2,
    Name: "หมวด MOIT ฝ่ายการแพทย์",
    Description: "หมวดย่อยเกี่ยวกับการดูแลผู้ป่วยและงานการแพทย์",
    YearID: 2568
  },
  {
    ID: 3,
    Name: "หมวด MOIT ฝ่ายเทคนิคการแพทย์",
    Description: "หมวดย่อยเกี่ยวกับเทคนิคการแพทย์และเครื่องมือทางการแพทย์",
    YearID: 2568
  },
  {
    ID: 4,
    Name: "หมวด MOIT ฝ่ายพยาบาล",
    Description: "หมวดย่อยเกี่ยวกับการพยาบาลและการดูแลผู้ป่วย",
    YearID: 2568
  },
  {
    ID: 5,
    Name: "หมวด MOIT ฝ่ายทันตกรรม",
    Description: "หมวดย่อยเกี่ยวกับการทันตกรรมและการดูแลช่องปาก",
    YearID: 2568
  },
  {
    ID: 6,
    Name: "หมวด MOIT ฝ่ายทันตกรรมจัดฟัน",
    Description: "หมวดย่อยเกี่ยวกับงานทันตกรรมจัดฟันและการรักษาความงาม",
    YearID: 2568
  }
]