export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  imageUrl?: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationDeadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'document' | 'video' | 'link' | 'other';
  url: string;
  imageUrl?: string;
  tags?: string[];
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
}
