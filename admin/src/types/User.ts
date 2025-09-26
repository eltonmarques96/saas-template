export interface UserTypes {
	id: string;
	nome: string;
	email: string;
}
export interface UserProfileTypes {
	id: string;
	nome: string;
	nome_social: string;
	sobMedidaProtetiva: boolean;
	use_nome_social: boolean;
	pcd: boolean;
	pcd_tipo: string;
	telefone: string;
	sexo: string;
	raca: string;
	celular: string;
	email: string;
	activated: boolean;
	objetos: {
		quantidade: number;
	};
}
