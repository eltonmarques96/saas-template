import { DocumentTypes } from "./Document";
import { OfficeTypes } from "./Office";

export interface UserTypes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto?: string;
  offices: OfficeTypes[];
  documents: DocumentTypes[];
  plan: UserPlans;
}

enum UserPlans {
  free = "free",
  pro = "pro",
  enterprise = "enterprise",
}
