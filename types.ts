import React from 'react';

export interface DesignConcept {
  conceptName: string;
  visualStyle: string;
  componentSystem: string;
  layoutWireframe: string;
  userFlow: string;
  creativeEnhancements: string;
  cssSnippet: string;
}

export interface LoadingState {
  isActive: boolean;
  isFading: boolean;
}

export interface LocationStatus {
  id: string;
  name: string;
  status: 'Open' | 'Closed' | 'Busy' | 'Maintenance';
  description: string;
  details: string;
  color: string;
  icon: React.ReactNode;
}