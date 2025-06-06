export interface OfficeTypes {
  id: string;
  fantasyName: string;
  officialName: string;
  companyCode: string;
  description?: string;
  area: string;
  phone: string;
  email: string;
  logo?: string;
  address: string;
  userId: string;
}

export const areasOfLawOptions = [
  { value: "criminal", label: "Criminal" },
  { value: "family", label: "Família" },
  { value: "business", label: "Negócios" },
  { value: "military", label: "Militar" },
  { value: "civil", label: "Civil" },
  { value: "labor", label: "Trabalhista" },
  { value: "environmental", label: "Ambiental" },
  { value: "tax", label: "Tributário" },
  { value: "intellectualProperty", label: "Propriedade Intelectual" },
  { value: "immigration", label: "Imigração" },
  { value: "healthcare", label: "Saúde" },
];
