export interface DocumentTypes {
  id: string;
  name: string;
  type: string;
  address: string;
  userId: string;
}

export const DocumentTypesList = [
  { value: "reuniao", label: "Reunião" },
  { value: "documento", label: "Documento de Cliente" },
];
