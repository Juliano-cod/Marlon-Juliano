export enum IdeaStatus {
  New = 'Nova',
  InProgress = 'Em Execução',
  Completed = 'Concluída',
}

export enum Priority {
  Low = 'Baixa',
  Medium = 'Média',
  High = 'Alta',
}

export interface Commit {
  timestamp: string;
  statusChange: string;
  comment?: string; // Optional comment field
}

export interface Idea {
  id: number;
  text: string;
  status: IdeaStatus;
  priority: Priority;
  commits: Commit[];
}
