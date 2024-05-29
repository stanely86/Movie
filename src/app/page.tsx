"use client"
import React from 'react';
import TestSearch from './TestSearch.client';

function Home() {
  return (
    <TestSearch />
  );
}

export default Home;

export const useClient = true; // Marking the component as a Client Component
