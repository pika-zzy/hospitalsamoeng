
export interface Employee {
    id: number;
    name: string;
    position: string;
    imgUrl?: string;
    contactInfo?: string;
    role?: EmployeeRole;
}

export type EmployeeRole = 
    | "Doctor"
    | "Nurse"
    | "Technician"
    | "Administrative"
    | "Director"
    | "SupportStaff";
