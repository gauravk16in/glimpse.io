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

export interface LiveUpdate {
  id: string;
  author: string;
  message: string;
  timestamp: string;
}

export interface BeaconRequest {
  id: string;
  locationId: string;
  item: string; // e.g., "iPhone Charger", "Scientific Calc"
  requester: string;
  status: 'pending' | 'fulfilled';
  timestamp: string;
  responder?: string;
}

export interface QueueAnalysis {
  status: 'Open' | 'Closed' | 'Busy' | 'Maintenance';
  description: string; // e.g., "Line extending to hallway"
  details: string; // e.g., "Est. Wait: 12 mins"
}

export interface LocationStatus {
  id: string;
  name: string;
  status: 'Open' | 'Closed' | 'Busy' | 'Maintenance';
  description: string;
  details: string;
  color: string;
  icon: React.ReactNode;
  liveUpdates: LiveUpdate[];
}

export interface Professor {
  id: string;
  name: string;
  department: string;
  status: 'Available' | 'In Class' | 'Busy' | 'Out of Office';
  location: string;
  availabilityTime?: string; // e.g., "Free at 2:00 PM"
  note?: string; // e.g., "Only for Section A doubts"
}