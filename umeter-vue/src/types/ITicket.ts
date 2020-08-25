interface ITicket {
    id: number;
    name: string;
    email: string;
    text: string;
    status: string;
}

enum ETicketStatus {
    RESOLVED = "Resolved",
    PENDING = "Pending",
}