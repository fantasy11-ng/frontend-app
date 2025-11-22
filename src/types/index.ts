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
  icon?: React.ComponentType<unknown>;
}

export interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
  userInitials?: string;
  currentPath?: string;
}

// Re-export predictor types
export * from './predictor';

// Re-export news types
export * from './news';

// Re-export team types
export * from './team';
