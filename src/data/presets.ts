export interface PresetCategory {
  id: string;
  title: string;
  texts: string[];
}

export const PRESET_CATEGORIES: PresetCategory[] = [
  {
    id: 'maqollar',
    title: 'O\'zbek Xalq Maqollari',
    texts: [
      'Bilagi zor birni yiqitadi, bilimi zor mingni yiqitadi.',
      'Harakatda barakat, mehnatda saodat bor.',
      'Oqish va organish hayot yolidagi eng yorug mayoqdir.',
      'Tilga ehtiyot bolgan elda hurmat topar, sozi shirin kishi dost qozonar.',
      'Bugungi ishni ertaga qoyma, har soniyaning oz qadri bor.',
      'Vaqt bu oqar daryo, uni unumli otkazgan inson hech qachon yutqazmaydi.',
    ],
  },
  {
    id: 'sozlar',
    title: 'Tezkor So\'zlar',
    texts: [
      'kitob qalam daftar dars maktab kompyuter dasturchi klaviatura intellekt kelajak bilim tajriba tezlik aniqlik natija intilish g\'alaba yutuq mahorat',
      'quyosh yulduz osmon shamol daryo dengiz daraxt gul tabiat gozallik orzu umid maqsad intilish mehnat ijodkorlik saodat baxt quvonch',
      'harf soz gap matn ovoz rang harakat qadam marra choqqi sinov saboq hayot sabr bardosh iroda quvvat jasorat parvoz',
    ],
  },
  {
    id: 'it_tech',
    title: 'Dasturlash va Texnologiya',
    texts: [
      'Frontend dasturlashda foydalanuvchi interfeysi tezkor va qulay bolishi kerak.',
      'Kompyuter klaviaturasi orqali teginib yozish tezlikni va diqqatni oshiradi.',
      'Zamonaviy veb ilovalari yuqori unumdorlik va chiroyli dizaynga ega boladi.',
      'Algoritm bu muammoni hal qilish uchun aniq belgilangan amallar ketma-ketligidir.',
    ],
  },
  {
    id: 'pangram',
    title: 'Pangramlar (Barcha harflar)',
    texts: [
      'Tez qongir tulki dangasa it ustidan sakrab otdi.',
      'Jurnalist gazeta sahifasida barcha muhim xabarlarni yoritdi.',
      'Har bir inson oz mahoratini har kuni oshirishga harakat qilishi lozim.',
    ],
  },
];
