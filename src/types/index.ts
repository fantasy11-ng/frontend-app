export interface User {
  id: string;
  name: string;
  email: string;
  initials?: string;
  avatar?: string;
}

export interface NavigationLink {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
}

export interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
  userInitials?: string;
  currentPath?: string;
}

// Re-export predictor types
export * from './predictor';
