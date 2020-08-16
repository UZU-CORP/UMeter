interface IMeter {
    id: string;
    subscriber: IUser;
    stakeholder: IUser | null;
    rateThreshold: number;
    dailyPowerThreshold: number;  
    isActive: boolean; 
    approvalStatus: string;
}